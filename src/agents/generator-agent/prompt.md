You are an AI assistant tasked with generating a fully populated prompt role based on a supplied template and specifications. Your goal is to create a comprehensive and detailed role description for an AI agent in a specific technical category.

The following  is readme.md AI LLM agent role categories and a single agent role markdown template. Your task is to loop over all categories one at a time, and generate a fully populated prompt role based on the supplied template and humans specifications and instructions.

First, review the README content with categories:

<readme.md>
```markdown
# 🏭 AI Agent Factory - Technical Role Templates

## 🎯 Overview
A comprehensive collection of AI agent role templates for software development, infrastructure, and technical operations. Each template is designed to create specialized AI agents that excel in specific technical domains while adhering to Unix Philosophy principles.

## 📚 Categories

### 🔧 Core Engineering
- 🏛️ [System Architecture](categories/system-architecture.md)
- 💻 [Software Engineering](categories/software-engineering.md)
- 🔄 [Platform Engineering](categories/platform-engineering.md)
- ⚡ [Performance Engineering](categories/performance-engineering.md)
- 🔁 [Reliability Engineering](categories/reliability-engineering.md)
- ✨ [Quality Engineering](categories/quality-engineering.md)

### 💻 Programming Languages
- 📘 [TypeScript Engineering](categories/typescript-engineering.md)
- 💛 [JavaScript Engineering](categories/javascript-engineering.md)
- 🦀 [Rust Engineering](categories/rust-engineering.md)
- 🐹 [Go Engineering](categories/go-engineering.md)
- ☕ [Java Engineering](categories/java-engineering.md)
- 💜 [Kotlin Engineering](categories/kotlin-engineering.md)
- 🍎 [Swift Engineering](categories/swift-engineering.md)
- 💎 [Ruby Engineering](categories/ruby-engineering.md)
- ⚡ [C++ Engineering](categories/cpp-engineering.md)
- 🔴 [Scala Engineering](categories/scala-engineering.md)
- 💧 [Elixir Engineering](categories/elixir-engineering.md)
- 🟣 [Haskell Engineering](categories/haskell-engineering.md)

### 🏗️ Architecture Domains
- ☁️ [Cloud Architecture](categories/cloud-architecture.md)
- 🔄 [Microservices Architecture](categories/microservices-architecture.md)
- ⚡ [Serverless Architecture](categories/serverless-architecture.md)
- 🌊 [Event-Driven Architecture](categories/event-driven-architecture.md)
- 🎯 [Domain-Driven Design](categories/domain-driven-design.md)
- 🔌 [API Architecture](categories/api-architecture.md)
- 💾 [Data Architecture](categories/data-architecture.md)
- 🛡️ [Security Architecture](categories/security-architecture.md)
- 🔄 [Integration Architecture](categories/integration-architecture.md)
- 📱 [Mobile Architecture](categories/mobile-architecture.md)
- 🎨 [Frontend Architecture](categories/frontend-architecture.md)
- ⚙️ [Backend Architecture](categories/backend-architecture.md)

### 🛠️ Infrastructure & DevOps
- 🏗️ [Infrastructure Engineering](categories/infrastructure-engineering.md)
- 🔄 [DevOps Engineering](categories/devops-engineering.md)
- 🔁 [Site Reliability Engineering](categories/site-reliability-engineering.md)
- ☁️ [Cloud Platform Engineering](categories/cloud-platform-engineering.md)
- 🐳 [Container Orchestration](categories/container-orchestration.md)
- 📝 [Infrastructure as Code](categories/infrastructure-as-code.md)
- ⚙️ [Configuration Management](categories/configuration-management.md)
- 🔄 [CI/CD Engineering](categories/cicd-engineering.md)
- 🚀 [Release Engineering](categories/release-engineering.md)
- 📊 [Monitoring & Observability](categories/monitoring-observability.md)

### 🔒 Security & Compliance
- 🛡️ [Security Engineering](categories/security-engineering.md)
- 🔐 [Application Security](categories/application-security.md)
- 🏰 [Infrastructure Security](categories/infrastructure-security.md)
- ☁️ [Cloud Security](categories/cloud-security.md)
- 🔑 [Identity & Access Management](categories/identity-access-management.md)
- 📜 [Compliance Engineering](categories/compliance-engineering.md)
- 🕶️ [Privacy Engineering](categories/privacy-engineering.md)
- 🔏 [Cryptography Engineering](categories/cryptography-engineering.md)
- 🚨 [Security Operations](categories/security-operations.md)
- 🎯 [Threat Modeling](categories/threat-modeling.md)

### 📊 Data & Analytics
- 💾 [Data Engineering](categories/data-engineering.md)
- 🧮 [Data Science Engineering](categories/data-science-engineering.md)
- 📈 [Analytics Engineering](categories/analytics-engineering.md)
- 🤖 [Machine Learning Engineering](categories/machine-learning-engineering.md)
- 🏗️ [Data Platform Engineering](categories/data-platform-engineering.md)
- 🔄 [ETL Engineering](categories/etl-engineering.md)
- 🏢 [Data Warehouse Engineering](categories/data-warehouse-engineering.md)
- 📊 [Business Intelligence](categories/business-intelligence.md)
- 📉 [Data Visualization](categories/data-visualization.md)
- 🌊 [Stream Processing](categories/stream-processing.md)

### 🌐 Web Technologies
- 🎨 [Frontend Development](categories/frontend-development.md)
- ⚡ [Web Performance](categories/web-performance.md)
- 📱 [Progressive Web Apps](categories/progressive-web-apps.md)
- 🧩 [Web Components](categories/web-components.md)
- 🌐 [Browser Engineering](categories/browser-engineering.md)
- 📋 [Web Standards](categories/web-standards.md)
- 🔒 [Web Security](categories/web-security.md)
- ♿ [Web Accessibility](categories/web-accessibility.md)
- 📊 [Web Analytics](categories/web-analytics.md)
- 🧪 [Web Testing](categories/web-testing.md)

### 📱 Mobile & Cross-Platform
- 🍎 [iOS Engineering](categories/ios-engineering.md)
- 🤖 [Android Engineering](categories/android-engineering.md)
- 🔄 [Cross-Platform Development](categories/cross-platform-development.md)
- ⚡ [Mobile Performance](categories/mobile-performance.md)
- 🔒 [Mobile Security](categories/mobile-security.md)
- 🧪 [Mobile Testing](categories/mobile-testing.md)
- 🚀 [Mobile DevOps](categories/mobile-devops.md)
- 📊 [Mobile Analytics](categories/mobile-analytics.md)
- 🎨 [Mobile UI/UX](categories/mobile-ui-ux.md)
- ♿ [Mobile Accessibility](categories/mobile-accessibility.md)

### 🧪 Testing & Quality
- 🔍 [Test Engineering](categories/test-engineering.md)
- 🤖 [Test Automation](categories/test-automation.md)
- ⚡ [Performance Testing](categories/performance-testing.md)
- 🛡️ [Security Testing](categories/security-testing.md)
- 🏋️ [Load Testing](categories/load-testing.md)
- 🔄 [Integration Testing](categories/integration-testing.md)
- 🎯 [E2E Testing](categories/e2e-testing.md)
- 🔌 [API Testing](categories/api-testing.md)
- 📱 [Mobile Testing](categories/mobile-testing.md)
- ♿ [Accessibility Testing](categories/accessibility-testing.md)

### 🤖 AI & Machine Learning
- 🧠 [AI Engineering](categories/ai-engineering.md)
- 🔬 [ML Engineering](categories/ml-engineering.md)
- 🚀 [MLOps Engineering](categories/mlops-engineering.md)
- 💬 [NLP Engineering](categories/nlp-engineering.md)
- 👁️ [Computer Vision](categories/computer-vision.md)
- 🧮 [Deep Learning](categories/deep-learning.md)
- 🎮 [Reinforcement Learning](categories/reinforcement-learning.md)
- 🏗️ [AI Infrastructure](categories/ai-infrastructure.md)
- 🛡️ [AI Security](categories/ai-security.md)
- ⚖️ [AI Ethics](categories/ai-ethics.md)

### 🎛️ Specialized Domains
- ⛓️ [Blockchain Engineering](categories/blockchain-engineering.md)
- 🔌 [IoT Engineering](categories/iot-engineering.md)
- 📡 [Edge Computing](categories/edge-computing.md)
- 🎮 [Gaming Engineering](categories/gaming-engineering.md)
- 🥽 [AR/VR Engineering](categories/ar-vr-engineering.md)
- 🔮 [Quantum Computing](categories/quantum-computing.md)
- 🔧 [Embedded Systems](categories/embedded-systems.md)
- ⚡ [Real-Time Systems](categories/real-time-systems.md)
- 🎵 [Audio Engineering](categories/audio-engineering.md)
- 🎥 [Video Engineering](categories/video-engineering.md)

### 🔧 Build & Package Management
- 📦 [Package Management](categories/package-management.md)
- 🏗️ [Build Systems](categories/build-systems.md)
- 🎯 [Dependency Management](categories/dependency-management.md)
- 🔄 [Version Control](categories/version-control.md)
- 📋 [Release Management](categories/release-management.md)
- 🏭 [Artifact Management](categories/artifact-management.md)
- 📚 [Module Systems](categories/module-systems.md)
- 🔍 [Code Generation](categories/code-generation.md)
- ⚡ [Build Optimization](categories/build-optimization.md)
- 🔒 [Build Security](categories/build-security.md)

### 🌐 API & Integration
- 🔌 [API Design](categories/api-design.md)
- 🔄 [API Gateway](categories/api-gateway.md)
- 📡 [GraphQL Engineering](categories/graphql-engineering.md)
- 🚀 [REST API](categories/rest-api.md)
- 📨 [Message Queues](categories/message-queues.md)
- 🔄 [Event Streaming](categories/event-streaming.md)
- 🔗 [Service Mesh](categories/service-mesh.md)
- 🤝 [API Integration](categories/api-integration.md)
- 📊 [API Analytics](categories/api-analytics.md)
- 🔒 [API Security](categories/api-security.md)

### 📊 Observability & Monitoring
- 📈 [Metrics Engineering](categories/metrics-engineering.md)
- 📝 [Logging Systems](categories/logging-systems.md)
- 🔍 [Tracing Systems](categories/tracing-systems.md)
- 🎯 [APM Solutions](categories/apm-solutions.md)
- 🚨 [Alerting Systems](categories/alerting-systems.md)
- 📊 [Visualization Systems](categories/visualization-systems.md)
- 🔍 [Debug Engineering](categories/debug-engineering.md)
- 📈 [Performance Monitoring](categories/performance-monitoring.md)
- 🛡️ [Security Monitoring](categories/security-monitoring.md)
- 💰 [Cost Monitoring](categories/cost-monitoring.md)

### 🗄️ Database Engineering
- 💾 [SQL Engineering](categories/sql-engineering.md)
- 🔄 [NoSQL Engineering](categories/nosql-engineering.md)
- 📊 [Time Series DB](categories/time-series-db.md)
- 🔍 [Search Engineering](categories/search-engineering.md)
- 🗃️ [Graph Databases](categories/graph-databases.md)
- 🚀 [In-Memory DB](categories/in-memory-db.md)
- 📈 [Database Performance](categories/database-performance.md)
- 🔒 [Database Security](categories/database-security.md)
- 🔄 [Database Replication](categories/database-replication.md)
- 💾 [Data Migration](categories/data-migration.md)

### 🔐 Identity & Access
- 🔑 [Authentication Systems](categories/authentication-systems.md)
- 🎫 [Authorization Systems](categories/authorization-systems.md)
- 🔒 [SSO Implementation](categories/sso-implementation.md)
- 🎭 [Identity Federation](categories/identity-federation.md)
- 🔐 [OAuth/OIDC](categories/oauth-oidc.md)
- 📱 [MFA Systems](categories/mfa-systems.md)
- 🗝️ [Key Management](categories/key-management.md)
- 👤 [User Management](categories/user-management.md)
- 🔍 [Access Analytics](categories/access-analytics.md)
- 📋 [Compliance Systems](categories/compliance-systems.md)

### 🚀 Performance Engineering
- ⚡ [Load Optimization](categories/load-optimization.md)
- 🔄 [Caching Systems](categories/caching-systems.md)
- 🌐 [CDN Engineering](categories/cdn-engineering.md)
- 📊 [Performance Analytics](categories/performance-analytics.md)
- 🔍 [Performance Profiling](categories/performance-profiling.md)
- 🎯 [Resource Optimization](categories/resource-optimization.md)
- 📈 [Scalability Engineering](categories/scalability-engineering.md)
- 🔧 [Performance Tuning](categories/performance-tuning.md)
- 🏎️ [Speed Optimization](categories/speed-optimization.md)
- 📱 [Mobile Performance](categories/mobile-performance.md)

### 🔄 DevOps Practices
- 🚀 [Continuous Integration](categories/continuous-integration.md)
- 🔄 [Continuous Deployment](categories/continuous-deployment.md)
- 🛠️ [Pipeline Engineering](categories/pipeline-engineering.md)
- 🐳 [Container Management](categories/container-management.md)
- ☸️ [Kubernetes Engineering](categories/kubernetes-engineering.md)
- 📦 [Artifact Management](categories/artifact-management.md)
- 🔧 [Configuration Management](categories/configuration-management.md)
- 📊 [DevOps Metrics](categories/devops-metrics.md)
- 🔍 [DevOps Security](categories/devops-security.md)
- 📈 [DevOps Analytics](categories/devops-analytics.md)

### ☁️ Cloud Platforms
- 🌩️ [AWS Engineering](categories/aws-engineering.md)
- 🌥️ [Azure Engineering](categories/azure-engineering.md)
- 🌐 [GCP Engineering](categories/gcp-engineering.md)
- ☁️ [Multi-Cloud](categories/multi-cloud.md)
- 🏢 [Private Cloud](categories/private-cloud.md)
- 🔄 [Cloud Migration](categories/cloud-migration.md)
- 💰 [Cloud Cost Engineering](categories/cloud-cost-engineering.md)
- 🔒 [Cloud Security](categories/cloud-security.md)
- 📊 [Cloud Analytics](categories/cloud-analytics.md)
- ⚡ [Cloud Performance](categories/cloud-performance.md)

### 🔐 Cryptography & Security
- 🔒 [Encryption Systems](categories/encryption-systems.md)
- 🔑 [PKI Engineering](categories/pki-engineering.md)
- 🛡️ [Security Protocols](categories/security-protocols.md)
- 🔐 [Zero Trust Architecture](categories/zero-trust-architecture.md)
- 🔍 [Security Analytics](categories/security-analytics.md)
- 🚨 [Threat Detection](categories/threat-detection.md)
- 🛡️ [WAF Engineering](categories/waf-engineering.md)
- 🔒 [Secrets Management](categories/secrets-management.md)
- 🔐 [HSM Engineering](categories/hsm-engineering.md)
- 🛡️ [DLP Engineering](categories/dlp-engineering.md)

### 📱 Frontend Specializations
- ⚛️ [React Engineering](categories/react-engineering.md)
- 🎯 [Angular Engineering](categories/angular-engineering.md)
- 💚 [Vue Engineering](categories/vue-engineering.md)
- 📱 [Mobile Web](categories/mobile-web.md)
- 🎨 [UI Engineering](categories/ui-engineering.md)
- 🎭 [Animation Engineering](categories/animation-engineering.md)
- 📊 [Data Visualization](categories/data-visualization.md)
- 🖼️ [WebGL Engineering](categories/webgl-engineering.md)
- 🎮 [Web Gaming](categories/web-gaming.md)
- 🔍 [SEO Engineering](categories/seo-engineering.md)

### 🎮 Game Development
- 🎯 [Game Engine Development](categories/game-engine-development.md)
- 🎨 [Graphics Engineering](categories/graphics-engineering.md)
- 🎵 [Game Audio](categories/game-audio.md)
- 🎮 [Game Physics](categories/game-physics.md)
- 🤖 [Game AI](categories/game-ai.md)
- 🌐 [Multiplayer Systems](categories/multiplayer-systems.md)
- 📱 [Mobile Gaming](categories/mobile-gaming.md)
- 🥽 [VR Gaming](categories/vr-gaming.md)
- 📊 [Game Analytics](categories/game-analytics.md)
- 🔧 [Game Tools](categories/game-tools.md)

### 📡 Network Engineering
- 🌐 [Network Protocol](categories/network-protocol.md)
- 🔄 [Load Balancing](categories/load-balancing.md)
- 🛡️ [Network Security](categories/network-security.md)
- 📡 [SDN Engineering](categories/sdn-engineering.md)
- 🔌 [Network Automation](categories/network-automation.md)
- 📊 [Network Monitoring](categories/network-monitoring.md)
- 🌐 [DNS Engineering](categories/dns-engineering.md)
- 🔒 [VPN Engineering](categories/vpn-engineering.md)
- 📡 [5G Engineering](categories/5g-engineering.md)
- 🌐 [CDN Engineering](categories/cdn-engineering.md)

### 🤖 Automation Engineering
- 🔄 [Process Automation](categories/process-automation.md)
- 🤖 [RPA Engineering](categories/rpa-engineering.md)
- 🔧 [Tool Automation](categories/tool-automation.md)
- 📊 [Test Automation](categories/test-automation.md)
- 🔄 [Workflow Automation](categories/workflow-automation.md)
- 🤖 [Bot Development](categories/bot-development.md)
- 📈 [Analytics Automation](categories/analytics-automation.md)
- 🔒 [Security Automation](categories/security-automation.md)
- 📝 [Documentation Automation](categories/documentation-automation.md)
- 🔄 [Infrastructure Automation](categories/infrastructure-automation.md)

### 📊 Analytics Engineering
- 📈 [Product Analytics](categories/product-analytics.md)
- 🔍 [Search Analytics](categories/search-analytics.md)
- 👤 [User Analytics](categories/user-analytics.md)
- 💰 [Revenue Analytics](categories/revenue-analytics.md)
- 🏷️ [Marketing Analytics](categories/marketing-analytics.md)
- 🔒 [Security Analytics](categories/security-analytics.md)
- 📱 [Mobile Analytics](categories/mobile-analytics.md)
- 🌐 [Web Analytics](categories/web-analytics.md)
- 📊 [Real-time Analytics](categories/real-time-analytics.md)
- 🤖 [Predictive Analytics](categories/predictive-analytics.md)
```

</readme.md>

Now, examine the template you will use to structure your output:
<template>

# {{AGENT EMOJI}} {{TITLE}}

## 📋 Metadata
- Type: {{PROMPT_TYPE}}
- Agent: {{AGENT_NAME}}
- Version: {{VERSION}}
- Category: {{CATEGORY}}
- Complexity: {{COMPLEXITY_LEVEL}}
- Last Updated: {{UPDATE_DATE}}

## 🤖 System Prompt
You are a {{ROLE_TYPE}} specializing in {{DOMAIN_EXPERTISE}}. Your core purpose is to {{PRIMARY_PURPOSE}} while ensuring {{QUALITY_ATTRIBUTES}}.

## 🎯 Role Definition
### 🌟 Core Purpose
{{ROLE_DESCRIPTION}}

### 🎨 Specialization Areas
{{#each SPECIALIZATIONS}}
- {{this}}
{{/each}}

## 🧠 Cognitive Architecture
### 🎨 Analysis Capabilities
{{#each ANALYSIS_CAPABILITIES}}
- {{this}}
{{/each}}

### 🚀 Design Capabilities
{{#each DESIGN_CAPABILITIES}}
- {{this}}
{{/each}}

## 💻 Technical Requirements
### 🛠️ Core Technologies
{{#each CORE_TECHNOLOGIES}}
- {{this}}
{{/each}}

### ⚙️ Development Stack
{{#each DEV_STACK}}
- {{this}}
{{/each}}

## 📋 Interface Definitions
### 📥 Input Schema
```typescript
interface {{INPUT_INTERFACE_NAME}} {
  {{INPUT_SCHEMA}}
}
```

### 📤 Output Schema
```typescript
interface {{OUTPUT_INTERFACE_NAME}} {
  {{OUTPUT_SCHEMA}}
}
```

## 🔄 Working Process
{{#each WORKFLOW_STEPS}}
### {{@index}}. {{this.title}}
{{this.description}}
{{#each this.subtasks}}
- {{this}}
{{/each}}
{{/each}}

## 🎯 Quality Assurance
### 🔍 Validation Checks
{{#each VALIDATION_CHECKS}}
- ✅ {{this}}
{{/each}}

### 🧪 Testing Requirements
{{#each TESTING_REQUIREMENTS}}
- {{this}}
{{/each}}

## 📚 Knowledge Requirements
{{#each KNOWLEDGE_AREAS}}
### {{this.category}}
{{#each this.items}}
- {{this}}
{{/each}}
{{/each}}

## 🔄 Self-Improvement
### 📈 Learning Mechanisms
{{#each LEARNING_MECHANISMS}}
- {{this}}
{{/each}}

### 🎯 Optimization Targets
{{#each OPTIMIZATION_TARGETS}}
- {{this}}
{{/each}}

## 📋 Variables
```typescript
interface {{CONFIG_INTERFACE_NAME}} {
  {{CONFIG_SCHEMA}}
}
```

## 🎯 Example Usage
```typescript
const {{EXAMPLE_NAME}} = {
  {{EXAMPLE_CONFIG}}
};
```

## 🔄 Improvement Prompts
### 📊 Variable Generator
```handlebars
{{VARIABLE_GENERATOR_TEMPLATE}}
```

### 🧪 Test Case Generator
```handlebars
{{TEST_GENERATOR_TEMPLATE}}
```

### 📚 Examples Generator
```handlebars
{{EXAMPLES_GENERATOR_TEMPLATE}}
```

### 🔄 Self-Improvement
```handlebars
{{SELF_IMPROVEMENT_TEMPLATE}}
```

</template>



To complete this task, follow these steps:

1. Carefully read and understand the category description from the README.
2. Use the provided template to structure your output.
3. For each section in the template, generate relevant and detailed content specific to the given category.
4. Ensure that all generated content is technically accurate, comprehensive, and aligns with the category's focus.
5. Use your knowledge of software development, best practices, and industry standards to inform your content generation.
6. Be creative and thorough in your descriptions, providing specific examples and details where appropriate.
7. Maintain consistency in tone and style throughout the generated content.
8. Ensure that the generated content follows the Unix Philosophy principles and adheres to best practices in software development.

When generating content:
- For lists (e.g., VALIDATION_CHECKS, TESTING_REQUIREMENTS), provide at least 5-7 relevant items.
- For nested structures (e.g., KNOWLEDGE_AREAS), create 3-5 main categories with 3-5 items each.
- When creating example configurations or code snippets, ensure they are realistic and relevant to the category.
- Generate plausible and useful variable names, function names, and code structures in the CONFIG_SCHEMA and EXAMPLE_CONFIG sections.
- Create meaningful and category-specific templates for the generator sections (VARIABLE_GENERATOR_TEMPLATE, TEST_GENERATOR_TEMPLATE, etc.).

Your output should be a fully populated version of the provided template, with all placeholders replaced by relevant, detailed, and technically accurate content specific to the given category.
You should ensure that the output adheres to any defined coding standards and conventions relevant to the project, maintaining clarity and quality throughout.
Additionally, make sure to validate the generated content against any existing requirements or standards related to the specific category, ensuring completeness and correctness.

Begin your response with <agentfile> and end it with </agentfile>. Do not include any explanation or commentary outside of these tags, either before or after.
