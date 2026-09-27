# 1mo.dev — 신입 개발자 전공 지식 & 기술 면접 백과사전

Codyssey AI/SW 올인원 과정 미션을 수행하며 정리한 개념 노트 모음 사이트입니다.
[VitePress](https://vitepress.dev)로 빌드하고 GitHub Pages + 커스텀 도메인(`1mo.dev`)으로 배포합니다.

- 원본 미션 코드/문서: [dubu-alt/Codyssey-B1](https://github.com/dubu-alt/Codyssey-B1)
- 제작: 1mo

## 로컬 실행

```bash
npm install
npm run docs:dev
```

## 빌드

```bash
npm run docs:build
```

빌드 결과물은 `docs/.vitepress/dist`에 생성됩니다.

## 글쓰기 (관리자 페이지)

[1mo.dev/admin](https://1mo.dev/admin/)에서 브라우저로 바로 글을 쓰고 고칠 수 있습니다. ([Sveltia CMS](https://sveltiacms.app))

- 이 저장소에 쓰기 권한이 있는 GitHub 계정의 토큰으로만 로그인할 수 있습니다. (처음 한 번 "토큰으로 로그인")
- 저장하면 `main` 브랜치에 바로 커밋되고, GitHub Actions가 1~2분 안에 사이트에 배포합니다.
- 새 글 파일 이름은 `날짜-제목.md`로 만들어지고, 사이드바와 홈 목록에 자동으로 추가됩니다.
- `임시저장(비공개)`을 켜 두면 사이트에 공개되지 않습니다.
- 이미지는 `docs/public/images`에 저장됩니다.

## 글 파일 형식

```md
---
title: "페이지 제목 (사이드바 이름으로도 사용)"
sidebar: "사이드바에만 보일 짧은 이름 (선택)"
draft: false
---

## 소제목부터 본문 시작
```

- 사이드바는 `docs/.vitepress/sidebar.ts`가 폴더의 글을 읽어서 자동으로 만듭니다. (파일 이름 순)
- 새 분류(폴더)를 추가할 때는 `sidebar.ts`와 `docs/public/admin/config.yml` 두 곳에 함께 추가해야 합니다.
