# Linting과 Formatter로 스타일 자동화하기

개발자는 반복 작업을 극도로 싫어합니다. 코드 스타일 규칙을 사람이 외우고 매번 손으로 맞추는 건 비효율적이죠. 그래서 등장한 게 **Linting**과 **Formatter**입니다.

- **Linting**: 코드의 스타일·문법·잠재적 오류가 규칙에 어긋나는지 자동으로 검사
- **Formatter**: Linting 규칙에 맞도록 코드를 자동으로 고쳐주는 도구

Linting은 팀 전체의 코딩 스타일을 통일시켜 가독성을 높이고, 리뷰어가 스타일 대신 로직에만 집중할 수 있게 해줍니다. 설정 파일을 프로젝트 루트에 두고 Git으로 공유하면, 새 팀원이 합류해도 규칙을 구두로 설명할 필요가 없습니다.

## JavaScript: ESLint + Prettier

적용 전:
```js
const name="John",age=25;function greet(name,age){console.log('Hello, '+name)}
```

적용 후:
```js
const name = 'John',
  age = 25;
function greet(name, age) {
  console.log('Hello, ' + name);
}
```

`.eslintrc`로 Lint 규칙을, `.prettierrc`로 포맷 규칙을 지정합니다. 단, 둘이 충돌할 수 있어서 `eslint-config-prettier` 같은 플러그인으로 충돌 규칙을 꺼줘야 합니다.

## Python: Flake8 + Black + isort

Python은 동적 타입 언어인 데다 쓰이는 분야(서버, 데이터, ML 등)가 워낙 다양해서 Linting 도구도 여러 가지입니다.

- **Flake8**: PEP 8 기반 스타일 검사 + 복잡도/논리 오류 검사 (`.flake8` 설정)
- **Black**: PEP 8에 맞춰 코드를 자동 정렬하는 Formatter (`pyproject.toml` 설정)
- **isort**: import 문을 표준 라이브러리 / 서드파티 / 프로젝트 내부 순으로 자동 정렬 (`.isort.cfg` 설정)

```
pip3 install flake8 black isort
flake8 src/
black src/
isort src/
```

> 출처: [Codyssey-B1/B2-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B2-2)
