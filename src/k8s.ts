var deployment = {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: {
        name: "recognized-deployment",
        labels: {
            app: "recognized",
        },
    },
    spec: {
        replicas: 0,
        selector: {
            matchLabels: {
                app: "recognized",
            },
        },
        template: {
            metadata: {
                labels: {
                    app: "recognized",
                },
            },
            spec: {
                containers: [
                    {
                        image: "nginx",
                        name: "nginx",
                        ports: {
                            containerPort: 80,
                        },
                    },
                ],
            },
        },
    },
}

var service = {
    apiVersion: "v1",
    kind: "Service",
    metadata: {
        name: "recognized-service",
        labels: {
            app: "recognized",
        },
    },
    spec: {
        replicas: 0,
        selector: {
            app: "recognized",
        },
        ports: [
            {
                protocol: "TCP",
                port: 80,
            }
        ]
    },
}

export function getDeployment(): any {
    return deployment;
}

export function getService(): any {
    return service;
}