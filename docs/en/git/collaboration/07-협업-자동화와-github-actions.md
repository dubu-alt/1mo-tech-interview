---
title: "Collaboration Automation & GitHub Actions CI"
sidebar: "Collaboration Automation & CI"
---

This page covers collaboration automation with the `.github` directory (CODEOWNERS, PR templates), followed by GitHub Actions CI implemented with `workflows` under the same directory.

## Collaboration Automation: the .github Directory

If you create a **`.github`** directory in the project root, you can use a variety of automation and communication features provided by GitHub.

### CODEOWNERS: assigning owners automatically

If you assign owners to specific files or directories, those owners are automatically added as reviewers whenever the files change. Combined with branch protection, you can even require that nothing is merged without the owner's approval.

Example `.github/CODEOWNERS` file:

```
# Assign an owner to a specific file
README.md   @username

# Assign an owner to an entire directory
/docs/     @organization/doc-team

# Assign an owner using a pattern
/src/*   @organization/python-team

# Assign an owner to all code in the repository
*   @username
```

The `@username` or team listed here must be registered as a **Collaborator** of the repository for this to work. (Assigning teams is only possible in organization repositories.)

### PR templates: a common format for reviews

If you create a `.github/PULL_REQUEST_TEMPLATE.md` file, its contents are automatically filled in whenever someone opens a PR. If you need several kinds of templates, put multiple `.md` files in the `.github/PULL_REQUEST_TEMPLATE/` directory.

```markdown
## PR Summary
- Briefly describe the main changes in this PR.

## Reason for Change
- Explain why this change is needed or its background.

## Checklist
- [ ] Are the reason and purpose of the code change clearly described?
- [ ] Have new tests been added, and do all existing tests pass?
- [ ] Is the changed code designed so that it does not affect existing features?
```

Thanks to this template, reviewers can grasp the purpose and scope of a PR much faster. In the same way, you can also add things like Issue Templates and Funding settings to the `.github` directory.

## Implementing CI with GitHub Actions

### Workflows and YAML

A **GitHub Workflow** is a feature that automatically performs tasks in response to events such as code changes, and it is mainly defined through **GitHub Actions**. Workflows are saved as `YAML` files in the `.github/workflows` directory. YAML is a format for structuring data, like JSON and XML, but its syntax is simple so it is easy to read and write.

Basic structure of a workflow file:
- `name`: the workflow name
- `on`: which event triggers it (e.g. push)
- `jobs`: the jobs to run

```yaml
name: Basic Workflow Example

on: [push]

jobs:
  example_job:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    - name: Print Hello
      run: echo "Hello, GitHub!"
```

After you commit/push this file, you can see the run history in the repository's **Actions** tab. Commonly used properties in `Steps` are `name` (step name), `run` (the command to run), `uses` (use a prebuilt action) and `with` (arguments to pass to that action).

### Hands-on: a Python code style CI with flake8

`.github/workflows/python-code-style.yaml`:

```yaml
name: Python CI with flake8

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  style-check:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-python@v2
      with:
        python-version: 3.8
    - run: |
        python -m pip install --upgrade pip
        pip install flake8
    - run: flake8 .
```

If you push code that breaks the rules and open a PR, the workflow runs automatically, and if it fails a red x appears on the PR page. You can check the reason for the failure right away in the Actions tab, and when you fix the code and push again it turns into a green check.

### Making CI success a required condition for merging

As things stand, a failing CI does not actually block the merge. Broken code could accidentally get into `main`. To prevent this:

```
Settings → Branches → Branch protection rule → Require status checks to pass before merging
```

If you set the workflow's job name (`style-check`) as a required check here, the merge button itself is disabled for any PR that has not passed CI.

## Summary

| Concept | One-line summary |
|---|---|
| CODEOWNERS / PR templates | Use the `.github` directory to assign reviewers automatically and standardize the PR format |
| GitHub Actions CI | Automatically run code style checks and tests with YAML in `.github/workflows`; set it as a required check to use it as a merge condition |

> Source: [Codyssey-B1/B2-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B2-2)
