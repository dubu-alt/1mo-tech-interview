---
title: "How a CPU Works (ALU · Control Unit · Registers)"
sidebar: "How a CPU Works"
---

The CPU (Central Processing Unit) is the most essential part of a computer, the equivalent of a person's **brain**. It repeats, extremely quickly, the job of taking instructions out of memory one at a time, interpreting them, and executing them.

## At a Glance

- A CPU is mainly made up of three things: the **arithmetic unit**, the **control unit**, and **registers**.
- Analogy: think of the CPU as **a kitchen where a single cook works**.
  - The control unit is the head that reads the recipe (the program) line by line and directs "do this next."
  - The arithmetic unit is the hands that actually chop and stir-fry.
  - Registers are small plates kept right next to the hands. They are the fastest because you can grab from them without walking to the fridge (memory).
- What the CPU does is ultimately a repetition of **fetch → decode → execute**.

![Von Neumann architecture made up of input device, CPU (control unit and arithmetic unit), memory, and output device](/images/computer-architecture/cpu-von-neumann-architecture.png)

*Image source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Von_Neumann_Architecture.svg) (CC BY-SA 3.0)*

As in the figure, most computers today follow the **von Neumann architecture**, in which programs and data are kept in the same memory and the CPU takes instructions out of that memory one at a time to execute them. The Control Unit in the figure is the control unit, the Arithmetic/Logic Unit is the arithmetic unit, and registers briefly hold values inside and around these two units.

## The Three Components of a CPU

### Arithmetic Unit (ALU)

- It performs **arithmetic operations** like addition and subtraction, and **logical operations** like AND, OR, and size comparison. That is why it is also called the **Arithmetic Logic Unit (ALU)**.
- It takes the data needed for an operation from registers and sends the result back to registers.

### Control Unit

- The unit that controls instructions so they can be executed **in order**.
- It takes program instructions out of main memory, decodes them, and based on the result sends the **control signals** needed to execute the instruction to memory, the arithmetic unit, and I/O devices.
- Conversely, it also receives signals sent by these devices and decides what to do next.

### Registers

- **Very fast storage** inside the CPU. They are the fastest in the memory hierarchy but also the smallest.
- They **temporarily** store instruction addresses, instruction codes, data needed for operations, operation results, and so on.
- By purpose, they are divided into two kinds.
  - **General-purpose registers**: temporarily store data needed for operations or the results of operations.
  - **Special-purpose registers**: registers used only for specific, predefined purposes.
- The number and size of available registers differ by CPU type. (e.g. each general-purpose register on a 64-bit CPU is 64 bits)

## Important Special-Purpose Registers

| Register | Name | What it stores | Analogy |
|----------|------|-------------|------|
| PC | Program Counter | The address of the instruction to execute **next** | A bookmark placed at the "next line" of the recipe |
| IR | Instruction Register | The instruction being executed **right now** | The recipe line you are reading right now |
| MAR | Memory Address Register | The main memory address to read or write | A note saying which fridge shelf |
| MBR | Memory Buffer Register | Data read from main memory, or data to be stored | A tray going back and forth between the fridge and the counter |
| AC | Accumulator | Temporarily stores operation results | A bowl that holds intermediate results of a calculation |

The MBR is also called the MDR (Memory Data Register).

## How a CPU Operates

When a program runs, the devices move in the following order.

1. Main memory reads in data received from an input device, or a program stored in secondary storage.
2. To run the program, the CPU reads the instructions and data stored in main memory, processes them, and stores the results back in main memory.
3. Main memory saves the processing results to secondary storage or sends them to an output device.
4. The control unit controls each device so that instructions are executed in order throughout steps 1~3.

```text
Secondary storage / input device
        │ ①
        ▼
   Main memory (RAM) ◀──── ② ────▶ CPU (fetch and process instructions, store results)
        │ ③
        ▼
Secondary storage / output device

④ The control unit directs the order of ①~③ as a whole
```

For the connecting pathways (buses) between devices, see [Computer Organization](/en/cs/computer-architecture/01-컴퓨터의-구성).

## Instruction Set

An **Instruction Set** is the set of instructions a CPU can execute. A single instruction is made up of two parts.

```text
┌──────────────────────┬──────────────────────────┐
│ Opcode               │ Operand                  │
│ what to do           │ with what / where        │
│ e.g. ADD             │ e.g. address 100         │
└──────────────────────┴──────────────────────────┘
```

- **Opcode**: the operation to execute. It covers operations, control (branching), data transfer, and I/O functions.
- **Operand**: the data needed for the operation, or the location where the data is stored. It holds addresses, numbers and characters, logical data, and so on.

Each CPU type (x86, ARM, etc.) has a different instruction set, so an executable built for one CPU does not run directly on a different kind of CPU. This topic continues in [ARM Processors](/en/cs/computer-architecture/07-arm-프로세서).

## Instruction Cycle

To run a program, the CPU repeats the process of **fetching, decoding, and executing** instructions from main memory **in order**.

The series of activities needed for the CPU to fetch **one** instruction from main memory and execute it is called the **Instruction Cycle**. The instruction cycle is divided into four parts.

| Cycle | What it does |
|--------|---------|
| Fetch cycle | Brings one instruction from the specified address in main memory |
| Indirect cycle | If the operand holds not the data's address but "the address of the place where the address is written," it reads the actual address one more time |
| Execute cycle | Executes the instruction |
| Interrupt cycle | If an interrupt request came in during execution, goes to handle it (see [Interrupts](/en/cs/os/08-인터럽트)) |

When one instruction finishes executing, the fetch cycle for the next instruction starts again. How registers move at each stage is covered separately in [Instruction Cycle](/en/cs/computer-architecture/03-명령어-사이클).

## Fetch Cycle: Bringing In an Instruction

> The most important part of the fetch cycle is **incrementing the PC value**. That is what lets it point to the next instruction.

1. Send the address stored in the PC to the MAR.
2. Using the address in the MAR, fetch the instruction from that location in main memory.
3. Store the fetched instruction in the MBR.
4. Increment the PC value so the next instruction can be fetched.
5. Send the instruction stored in the MBR to the IR (instruction register).

Written in symbols by time step (T0, T1, T2), it looks like this. `←` means "put the value on the right into the left," and `M[MAR]` means "the value in memory at the address the MAR points to."

```text
T0 : MAR ← PC
T1 : MBR ← M[MAR],  PC ← PC + 1
T2 : IR  ← MBR
```

The memory read and the PC increment are written together in T1 because they use different parts, so they can be done **at the same time, in the same clock tick**. That is the whole process of fetching an instruction.

The `+1` in `PC ← PC + 1` means "the next instruction." In a real CPU, the address increases by the size of one instruction (e.g. 4 bytes).

## Execute Cycle: Executing Each Instruction

Once fetching is done, the instruction is in the IR. Since fetching is already finished, there is no need to increment the PC in the execute cycle. Below, `IR(Addr)` means "the operand (address) part of the instruction in the IR."

### ADD addr: Add

Adds the value at memory address addr to the AC.

```text
T0 : MAR ← IR(Addr)
T1 : MBR ← M[MAR]
T2 : AC  ← AC + MBR
```

Once the data has been brought into the MBR, all that's left is to add the MBR value to the AC.

### LOAD addr: Load

An instruction that moves data from memory into the AC.

```text
T0 : MAR ← IR(Addr)
T1 : MBR ← M[MAR]
T2 : AC  ← MBR
```

### STA addr: Store

An instruction that stores the data in the AC into memory. (STA = STore Accumulator)

```text
T0 : MAR    ← IR(Addr)
T1 : MBR    ← AC
T2 : M[MAR] ← MBR
```

### JUMP addr: Jump

A **branch instruction** that changes the PC value to the address in the IR. Since the next fetch cycle starts at address addr, the program's flow of execution jumps there. Loops and if statements are built from branch instructions like this.

```text
T0 : PC ← IR(Addr)
```

## Following Along in Code

Let's imitate the process above in Python. This is a program that adds 7 and 5 and stores the result at address 12.

```python
# Imitating a very simple accumulator (AC) style CPU
# Memory addresses 0~3: instructions, 10~12: data
memory = {
    0: ('LOAD', 10),   # AC ← M[10]
    1: ('ADD', 11),    # AC ← AC + M[11]
    2: ('STA', 12),    # M[12] ← AC
    3: ('HALT', None),
    10: 7,
    11: 5,
    12: 0,
}

PC, AC = 0, 0
while True:
    # Fetch cycle
    MAR = PC                 # T0: MAR ← PC
    MBR = memory[MAR]        # T1: MBR ← M[MAR]
    PC = PC + 1              #     PC ← PC + 1
    IR = MBR                 # T2: IR ← MBR
    op, addr = IR
    if op == 'HALT':
        break
    # Execute cycle
    if op == 'LOAD':
        MAR = addr; MBR = memory[MAR]; AC = MBR
    elif op == 'ADD':
        MAR = addr; MBR = memory[MAR]; AC = AC + MBR
    elif op == 'STA':
        MAR = addr; MBR = AC; memory[MAR] = MBR
    elif op == 'JUMP':
        PC = addr
    print(f'{op:4} {addr} -> AC={AC}, PC={PC}')

print('Value at address 12:', memory[12])
```

Output:

```text
LOAD 10 -> AC=7, PC=1
ADD  11 -> AC=12, PC=2
STA  12 -> AC=12, PC=3
Value at address 12: 12
```

You can see that every time an instruction finishes, the PC increases by 1 and points to the next instruction. A real CPU repeats this process billions of times per second. How the operating system divides this CPU time among multiple programs is covered in [CPU Analysis](/en/cs/os/05-cpu-분석).

## Summary

| Concept | Plain-language summary |
|------|-------------------|
| CPU | The computer's brain that fetches, interprets, and executes instructions |
| Arithmetic unit (ALU) | The hands that actually calculate and compare |
| Control unit | The head that reads the recipe and directs the order |
| Registers | The fastest, smallest temporary plates inside the CPU |
| PC | A bookmark pointing to where the next instruction is |
| IR | The instruction being executed right now |
| MAR / MBR | Slots that briefly hold the memory "address" and the "data going back and forth" |
| AC | A bowl that holds calculation results |
| Instruction | Opcode (what to do) + operand (with what/where) |
| Instruction cycle | Fetch → (indirect) → execute → (interrupt), repeated over and over |
