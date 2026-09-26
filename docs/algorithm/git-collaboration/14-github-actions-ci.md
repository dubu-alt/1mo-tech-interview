# GitHub Actions로 CI 구현하기

## Workflow와 YAML

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

## 실전: flake8으로 Python 코드 스타일 CI 만들기

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

## CI 통과를 머지의 필수 조건으로 만들기

CI가 실패해도 지금 상태로는 머지 자체는 막히지 않습니다. 실수로 깨진 코드가 `main`에 들어갈 수 있는 것이죠. 이를 막으려면:

```
Settings → Branches → Branch protection rule → Require status checks to pass before merging
```

여기서 워크플로우의 job 이름(`style-check`)을 필수 체크로 지정하면, 이제 CI를 통과하지 못한 PR은 머지 버튼 자체가 비활성화됩니다.

> 출처: [Codyssey-B1/B2-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B2-2)
