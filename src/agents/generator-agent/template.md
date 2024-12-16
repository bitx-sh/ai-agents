# 🎯 {{TITLE}}

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