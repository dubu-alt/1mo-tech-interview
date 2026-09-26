# Redis란? 그리고 왜 만들어보나?

**Redis** = 데이터를 **메모리(RAM)**에 저장해서 엄청 빠르게 읽고 쓰는 저장소.
캐시(임시 저장), 세션 저장 등에 전 세계적으로 쓰입니다.

이 미션은 Redis **그 자체**가 아니라, Redis가 빠른 이유인 **내부 자료구조 3종**(해시맵, 이중 연결 리스트, 힙)을
직접 손으로 구현하면서 원리를 체득하는 것이 목표입니다.
그래서 Python이 기본 제공하는 `dict`, `set`, `collections` 사용이 **금지**되어 있습니다.

---


> 출처: [Codyssey-B1/B5-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B5-1)