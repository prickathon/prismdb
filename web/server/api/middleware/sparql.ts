import type { KeyValue } from "./util";

interface Binding {
	[key: string]: {
		datatype: string;
		value: string;
	};
}

interface QueryResult {
	head: {
		vars: string[];
	};
	results: {
		bindings: Binding[];
	};
}

const schemaUri = "https://prismdb.takanakahiko.me/prism-schema.ttl#";
const typePredUri = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const schema2uri = (schema: string) => `${schemaUri}${schema}`;
const uri2key = (uri: string) =>
	uri.replace(/https:\/\/prismdb\.takanakahiko\.me\/rdfs\/.+?\//, "");
const classBaseUri = (className: string) =>
	`https://prismdb.takanakahiko.me/rdfs/${className.toLowerCase()}/`;

const bindings2object = (
	bindings: Binding[],
	arrayParameters: { [_: string]: string } = {},
) => {
	const ret: KeyValue = {};
	for (const [, parameterName] of Object.entries(arrayParameters)) {
		ret[parameterName] = [];
	}
	for (const b of bindings) {
		const pred = b.pred?.value;
		if (!pred?.includes(schemaUri)) {
			continue;
		}
		const predicateName = pred.replace(schemaUri, "");
		let value: unknown = uri2key(b.obj?.value ?? "");
		switch (b.obj?.datatype) {
			case "http://www.w3.org/2001/XMLSchema#integer":
				value = parseInt(value as string, 10);
				break;
		}
		if (arrayParameters && predicateName in arrayParameters) {
			const parameterName = arrayParameters[predicateName] as string;
			ret[parameterName].push(value);
		} else {
			ret[predicateName] = value;
		}
	}
	return ret;
};

async function q(query: string) {
	const response = await fetch(
		`${process.env.SPARQL_ENDPOINT_URL}?query=${encodeURIComponent(query)}&format=json`,
		{
			method: "GET",
			headers: { "Content-Type": "application/sparql-query+json" },
		},
	);
	return (await response.json()) as QueryResult;
}

async function getKeys(className: string) {
	const query = `SELECT ?sub WHERE { ?sub <${typePredUri}> <${schema2uri(className)}> }`;
	const resp = await q(query);
	const subjectUris = resp.results.bindings.map((b) => b.sub?.value ?? "");
	return subjectUris.map(uri2key);
}

async function getInstanceList(
	className: string,
	arrayParameters?: { [_: string]: string },
) {
	const classUrl = schema2uri(className);
	const query = `SELECT ?sub ?pred ?obj WHERE { ?sub <${typePredUri}> <${classUrl}>; ?pred ?obj. }`;
	const resp = await q(query);
	const subjectUris = resp.results.bindings.map((b) => b.sub?.value ?? "");
	const uniqueSubjectUris = subjectUris.filter(
		(x, i, self) => self.indexOf(x) === i,
	);
	return uniqueSubjectUris.map((subjectUri) => {
		const targetBindings = resp.results.bindings.filter(
			(b) => b.sub?.value === subjectUri,
		);
		const instance = bindings2object(targetBindings, arrayParameters);
		instance._key = uri2key(subjectUri);
		return instance;
	});
}

async function getInstance(
	className: string,
	key: string,
	arrayParameters?: { [_: string]: string },
) {
	const subject = `${classBaseUri(className)}${key}`;
	const query = `SELECT ?pred ?obj WHERE { <${subject}> ?pred ?obj }`;
	const resp = await q(query);
	return bindings2object(resp.results.bindings, arrayParameters);
}

export default { getKeys, getInstanceList, getInstance, q };
