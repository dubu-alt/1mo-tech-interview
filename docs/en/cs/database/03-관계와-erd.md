---
title: "Relationships and ERD (1:1, 1:N, N:M)"
sidebar: "Relationships and ERD"
---

This page first looks at the types of relationships between tables (1:1 / 1:N / N:M) using project examples, then continues with the nature of entity relationships, how entities are classified, and 5 ERD notations for drawing them.

## Types of Relationships (1:1 / 1:N / N:M)

- **1:1**: one row connects to exactly one row of another table (not in this project)
- **1:N (one-to-many)**: 1 parent row connects to many child rows. All 5 relationships in this project are this type
  (1 user - many reels, 1 reel - many likes, etc.)
- **N:M (many-to-many)**: a relationship where both sides can connect to many rows of each other. This can only be expressed by adding a connecting table
  (junction table) in the middle. In the original design, `reels` and `hashtags` had
  this relationship and it was resolved with a junction table called `reel_hashtags`, but in this 4-table version
  it was simplified into a `reels.hashtags` text column, which removed the N:M structure entirely.

## Relationships Between Entities: Existence vs Action

An **entity** is something you want to manage with a database (a person, a thing, an event, etc.), and a **relationship** is the business connection between those entities. Relationships fall into two broad kinds.

### Existence Relationship: Holds Even When Nothing Happens

A relationship where things are **naturally connected just by existing**, without any action. It mostly appears in belonging/containment structures.

- `Department` - `Employee`: the moment someone joins the company, they already belong to some department.
- `College` - `Major`: a major sits under a specific college from the very start.

### Action Relationship: Created Only When an Event Happens

A relationship where two entities have no connection while idle, and it is created only **when a specific action (event) occurs**.

- `Customer` - `Order`: order data is created only when a customer performs the "act of buying."
- `Student` - `Course Registration`: data is created only when there is an "act of registering."

### An M:N Relationship Cannot Become a Table as Is

Logically you can draw a many-to-many (M:N) relationship, but M:N cannot be implemented directly as real tables (the physical model). So an **intersection entity** is inserted in the middle to split it into two 1:N relationships. Most "action relationships" are realized in exactly this intersection-entity form. (`Student` -N:M- `Course` → `Student` -1:N- `Course Registration` -N:1- `Course`)

### Self-Referencing Relationship

There are also relationships where an entity **references itself**. For example, it is used in an `Employee` table to express a hierarchy such as "this person's manager is also an employee." It is a normal modeling approach for building up-and-down relationships among data of the same kind, like a company org chart.

### What to Write When Drawing a Relationship

A single relationship line usually carries three pieces of information.

- **Relationship name**: what kind of relationship the two entities have (e.g. a customer "places" an order)
- **Degree (cardinality)**: how many on the other side attach to one on this side (1:1, 1:N, M:N)
- **Optionality**: whether it must exist (mandatory) or may be absent (optional)

A relationship is a **logical connection** meaning "by business rules, these two are linked," so even if the real tables don't have an FK yet, you can draw the relationship first in a logical ERD. In an ERD, existence relationships are mostly drawn with solid lines (identifying relationships) or dotted lines where the parent must exist, and action relationships are mostly drawn with dotted lines (non-identifying relationships).

## How Entities Are Classified

Entities can also be divided by their nature. There are two main criteria: **is it something you can see**, and **when does it appear in the business flow**.

### Can You See It: Tangible, Conceptual, Event

| Category | Meaning | Examples |
| --- | --- | --- |
| **Tangible entity** | Something with a physical form that lasts a long time. The easiest to find | Employee, product, member, book, vehicle |
| **Conceptual entity** | A concept with no physical form that still needs to be managed | Department, major, financial product, account title |
| **Event entity** | A record of actions/activities that occur while doing business. Raw material for statistics and history | Order, payment, reservation, shipment |

### When Does It Appear: Basic, Central, Action

This criterion shows up especially often on the SQLD exam. It is easy if you think of entities appearing in the order the business flows.

```
Basic (key) entity  →  Central (main) entity  →  Action entity
  Customer, Product        Order                    Order Detail, Payment Cancellation History
 (exists on its own)    (core business event)    (records that keep piling up as work proceeds)
```

- **Basic entity (key entity)**: an entity that **can come into being on its own** without other entities. It has no parent and acts as a parent to other entities. Examples: employee, customer, product, department, course
- **Central entity (main entity)**: an entity that arises from basic entities and becomes **the core of that business**. It has a lot of data and is the basis for creating action entities. Examples: order, intake, contract, sales
- **Action entity**: an entity that is **finally created as the business proceeds**, from two or more parents (basic/central entities). Its contents are frequently added to and changed, and it mostly appears in the detailed design stage. Examples: order detail, contract change history, employee assignment history

::: tip How it shows up on exams
- In "A customer orders a product," what is the central entity? **Order** (customer and product are basic entities)
- "Which entity acts as a parent to other entities and is created independently?" **Basic (key) entity**
- Questions also often mix the tangible/intangible classification (tangible/conceptual/event) and the time-of-creation classification (basic/central/action) in the choices and ask you to pick the one that is different in nature.
:::

## ERD Notations

An **ERD (Entity Relationship Diagram)** is a picture of entities and relationships. There are several ways (notations) to draw one; the information conveyed (entities, attributes, relationships, degree, optionality) is the same and **only the shapes differ**. In practice and in tools, Crow's Foot (IE) notation is used the most.

### Crow's Foot Notation

The name comes from the symbol at the end of the relationship line, which splits like a crow's footprint. Entities are drawn as rectangles (tables), with the entity name above the table and the identifier (PK) in the first row.

```
┌────────────┐
│  Employee  │  ← entity name
├────────────┤
│ *EmpNo     │  ← identifier (PK)
│  Name      │
│  DeptNo    │
└────────────┘
```

A single symbol expresses both **how many at most (degree)** and **whether it must exist (optionality)** at once. Read the symbol closer to the end of the line as "at most how many" and the one farther away as "at least how many."

```
──○<   zero or many (optional + many)
──│<   one or more (mandatory + many)
──○|   zero or one (optional + one)
──||   exactly one (mandatory + one)
```

For example, drawing `Department ──||────○< Employee` means "an employee must belong to exactly one department, and a department can have zero or more employees."

![Collection of Crow's Foot notation symbols](/images/database/e5855c5888d9.png)

![Example relationship drawn in Crow's Foot notation](/images/database/e6114664ba71.png)

![Crow's Foot relationship symbol 1](/images/database/e03bc090e7be.png)
![Crow's Foot relationship symbol 2](/images/database/c4fa02aec7f9.png)
![Crow's Foot relationship symbol 3](/images/database/cfc7c68c747f.png)
![Crow's Foot relationship symbol 4](/images/database/ce723e08f1e4.png)
![Crow's Foot relationship symbol 5](/images/database/f3c49de3298e.png)

![Entity in Crow's Foot notation: name above the table, identifier in the first row](/images/database/f6a2c0e8642c.png)

### Peter Chen Notation

The approach of Peter Chen, who first created the ERD. **Entities are rectangles, relationships are diamonds, and attributes are ovals**, all drawn separately. The diagram gets large, but it is good for explaining concepts, so you see it a lot in textbooks and conceptual modeling.

![Peter Chen notation 1](/images/database/f023e0dd4e86.png)

![Peter Chen notation 2](/images/database/ea37557e44fb.png)

### Information Engineering (IE) Notation

The Crow's Foot notation seen above is exactly the Information Engineering notation. It was organized by James Martin and others, and since it is the default notation of modeling tools like ERwin, it is **the most common in practice**. It adds crow's feet (many), bars (1), and circles (0) to relationship lines to express degree and optionality.

![Information Engineering (IE) notation](/images/database/efb8e1b3f213.png)

### Ellis-Barker Notation

A notation known as the one Oracle used (Oracle Case Method). The relationship line is split in half, and you read it as **mandatory if your half is a solid line, optional if it is dotted**. Crow's feet go on the "many" side, and attributes inside an entity get symbols such as `#` (identifier), `*` (mandatory), and `o` (optional) in front.

![Ellis-Barker notation](/images/database/d07971bb4fb4.png)

### IDEF1X Notation

A standard notation created by the US Air Force. **Entities that exist on their own (independent entities) are drawn as square-cornered rectangles, and entities that rely on a parent (dependent entities) as round-cornered rectangles.** Identifying relationships use solid lines and non-identifying relationships use dotted lines, strictly separated, and the "many" end is marked with a black dot (●) instead of a crow's foot.

![IDEF1X notation 1](/images/database/d2d5e42f0f17.png)

![IDEF1X notation 2](/images/database/cffe837d06a6.png)

### UML Notation

A way of drawing an ERD with UML class diagrams used in software design. Its distinguishing feature is **writing counts as numbers** instead of symbols, such as `1` (exactly one), `0..1` (none or one), `0..*` (zero or more), and `1..*` (one or more).

![UML notation](/images/database/d1301aa7286e.png)

### Comparison at a Glance

| Notation | Entity | Relationship | Count (degree) | Mainly used in |
| --- | --- | --- | --- | --- |
| Peter Chen | Rectangle | Diamond | 1, N, M on the line | Textbooks, conceptual models |
| IE (Crow's Foot) | Rectangle (table) | Line | Crow's foot, bar, circle | Practice, tools like ERwin |
| Ellis-Barker | Rounded rectangle | Line (half solid, half dotted) | Crow's foot | Oracle family |
| IDEF1X | Square-cornered for independent, rounded for dependent | Solid (identifying), dotted (non-identifying) | Black dot (●) | Public sector, defense standards |
| UML | Class box | Line | Numbers (`1`, `0..*`) | Software design |

## Summary

| Concept | Key point |
| --- | --- |
| 1:1 | One row connects to exactly one row of another table |
| 1:N | 1 parent row - many child rows (all 5 relationships in the project) |
| N:M | Implemented by splitting into 1:N + 1:N with a junction table / intersection entity |
| Existence / action relationship | Connected just by existing (department-employee) / created only by an action (customer-order) |
| Self-referencing relationship | An entity references itself (employee-manager) |
| Relationship notation elements | Relationship name, degree (cardinality), optionality (mandatory/optional) |
| Entity classification | Can you see it (tangible/conceptual/event), when does it appear (basic/central/action) |
| ERD Crow's Foot notation | Symbols at the end of the line express degree (1/many) and optionality (mandatory/optional) together |
| Other ERD notations | Peter Chen (diamond relationships), Ellis-Barker (half solid/half dotted), IDEF1X (square/rounded rectangles), UML (counts as numbers) |

> Source: [Codyssey-B1/B6-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B6-1)

> Reference: personal Notion study notes
