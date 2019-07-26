workflow "Install, Build" {
  on = "push"
  resolves = ["Build"]
}

action "Install" {
  uses = "docker://node:latest"
  runs = "cd csv2rdf && npm ci"
}

action "Build" {
  needs = "Install"
  uses = "docker://node:latest"
  runs = "cd csv2rdf && npm run start"
}
