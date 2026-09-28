---
title: "협업 자동화 & GitHub Actions CI"
sidebar: "협업 자동화 & CI"
---

`.github` 디렉토리를 활용한 협업 자동화(CODEOWNERS, PR 템플릿)와, 같은 디렉토리 아래 `workflows`로 구현하는 GitHub Actions CI를 이어서 다룹니다.

## 협업 자동화: .github 디렉토리

프로젝트 루트에 **`.github`** 디렉토리를 만들면, GitHub가 제공하는 다양한 자동화·커뮤니케이션 기능을 쓸 수 있습니다.

### CODEOWNERS: 담당자 자동 지정

특정 파일이나 디렉토리에 책임자를 지정해두면, 그 파일이 바뀔 때마다 담당자가 리뷰어로 자동 할당됩니다. Branch protection과 함께 쓰면 담당자 승인 없이는 머지가 안 되도록 강제할 수도 있습니다.

`.github/CODEOWNERS` 파일 예시:

```
# 특정 파일에 대한 책임자 지정
README.md   @username

# 디렉토리 전체에 대한 책임자 지정
/docs/     @organization/doc-team

# 패턴을 통한 책임자 지정
/src/*   @organization/python-team

# 레포지토리의 모든 코드에 대한 책임자 지정
*   @username
```

여기 적힌 `@username`이나 팀은 반드시 저장소의 **Collaborator**로 등록되어 있어야 동작합니다. (팀 지정은 organization 저장소에서만 가능합니다.)

### PR 템플릿: 리뷰를 위한 공통 양식

`.github/PULL_REQUEST_TEMPLATE.md` 파일을 만들어두면, 누군가 PR을 생성할 때 이 내용이 자동으로 채워집니다. 여러 종류의 템플릿이 필요하면 `.github/PULL_REQUEST_TEMPLATE/` 디렉토리에 여러 `.md` 파일을 두면 됩니다.

```markdown
## PR 요약
- 이 PR의 주요 변경 사항을 간략하게 기술해 주세요.

## 변경 사유
- 이 변경이 필요한 이유나 배경을 설명해 주세요.

## 체크리스트
- [ ] 코드의 변경 사유와 목적이 명확하게 기술되었나요?
- [ ] 새로운 테스트가 추가되었고, 기존 테스트는 모두 통과하나요?
- [ ] 변경된 코드가 기존 기능에 영향을 주지 않도록 설계되었나요?
```

리뷰어는 이 템플릿 덕분에 PR의 목적과 변경 범위를 훨씬 빠르게 파악할 수 있습니다. 같은 방식으로 `.github` 디렉토리에는 Issue Template, Funding 설정 같은 것도 추가할 수 있습니다.

## GitHub Actions로 CI 구현하기

### Workflow와 YAML

**GitHub Workflow**는 코드 변경 같은 이벤트에 반응해서 자동으로 작업을 수행하는 기능으로, 주로 **GitHub Actions**를 통해 정의합니다. `.github/workflows` 디렉토리 안에 `YAML` 파일로 저장합니다. YAML은 JSON, XML처럼 데이터를 구조화하는 형식인데, 문법이 단순해서 읽고 쓰기가 편합니다.

워크플로우 파일의 기본 구성:
- `name`: 워크플로우 이름
- `on`: 어떤 이벤트에 실행할지 (예: push)
- `jobs`: 실행할 작업들

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

이 파일을 커밋/푸시하면 저장소의 **Actions** 탭에서 실행 내역을 확인할 수 있습니다. `Steps`에서 자주 쓰는 속성은 `name`(단계 이름), `run`(실행할 명령), `uses`(미리 만들어진 액션 사용), `with`(해당 액션에 넘길 인자)입니다.

### 실전: flake8으로 Python 코드 스타일 CI 만들기

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

규칙에 어긋나는 코드를 올려서 PR을 만들면 워크플로우가 자동 실행되고, 실패하면 PR 화면에 빨간 x가 뜹니다. Actions 탭에서 어떤 이유로 실패했는지 바로 확인할 수 있고, 코드를 고쳐 다시 push하면 초록 체크로 바뀝니다.

### CI 통과를 머지의 필수 조건으로 만들기

CI가 실패해도 지금 상태로는 머지 자체는 막히지 않습니다. 실수로 깨진 코드가 `main`에 들어갈 수 있는 것이죠. 이를 막으려면:

```
Settings → Branches → Branch protection rule → Require status checks to pass before merging
```

여기서 워크플로우의 job 이름(`style-check`)을 필수 체크로 지정하면, 이제 CI를 통과하지 못한 PR은 머지 버튼 자체가 비활성화됩니다.

## 정리

| 개념 | 한 줄 요약 |
|---|---|
| CODEOWNERS / PR 템플릿 | `.github` 디렉토리로 리뷰어 자동 지정, PR 작성 양식 통일 |
| GitHub Actions CI | `.github/workflows`의 YAML로 코드 스타일 검사·테스트를 자동 실행, 필수 체크로 지정하면 머지 조건으로도 사용 가능 |

> 출처: [Codyssey-B1/B2-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B2-2)
