---
title: "ARM Processor (RISC vs CISC)"
sidebar: "ARM Processor"
---

ARM is a **processor design approach (instruction set architecture)** found in most smartphones and tablets, and these days also in Apple Macs and some servers. Its core is a **RISC design with only simple instructions**, and its strengths are being small and using little power.

## At a Glance

- **What is a processor?** A device that executes the instructions stored in memory one at a time. In theory, it can be seen as "a machine whose next state is determined by its current state and input (instruction)," that is, a **finite state automaton**. How instructions are executed is covered in [How a CPU Works](/en/cs/computer-architecture/02-cpu-작동-원리).
- **ARM** originally stood for **Acorn RISC Machine**, and later changed to **Advanced RISC Machine**. As the name shows, the core of ARM is **RISC**. Today the company name is simply written as "Arm."
- Analogy: **RISC is a cook who works fast with a few simple tools**, and **CISC is a cook equipped with an all-in-one appliance full of features**. Simple tools are small, cheap, and easy to handle, so they fit especially well in a tiny kitchen (a smartphone).

## RISC and CISC

**RISC (Reduced Instruction Set Computing)** was born from the idea: "Wouldn't a processor with a simple instruction set be much more efficient than one with a complex instruction set?"

The opposite concept is **CISC (Complex Instruction Set Computing)**, and Intel and AMD's **x86**, widely used in PCs, is the classic example.

| Category | RISC (e.g. ARM) | CISC (e.g. x86) |
|------|----------------|----------------|
| Number of instructions | Few and simple | Many and complex |
| Instruction length | Mostly fixed length | Varies by instruction |
| What one instruction does | Little. Work is done by combining several | A lot. One instruction may read memory and compute at the same time |
| Memory access | Only dedicated read (Load) and write (Store) instructions access memory | Many instructions access memory directly |
| Chip structure | Simple and small | Complex and large |
| Power | Uses little | Uses relatively more |

For reference, modern x86 CPUs also internally break complex instructions into simple small instructions (micro-operations) before executing them. So the line between RISC and CISC is blurrier than it used to be, but the fact that **the visible instruction sets are different** still holds.

## ARM's Structure and Business Model

Arm (the company) does not make and sell chips itself. It **creates chip designs and the instruction set and sells them as licenses**, while individual semiconductor manufacturers handle adding features, optimizing, and actually producing the chips.

```text
           ┌──────────────────────────────┐
           │        Arm (company)         │
           │ Instruction set + CPU core   │
           │          designs             │
           └───────────────┬──────────────┘
                           │ sells licenses
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
    Qualcomm            Samsung             Apple       ...
   (Snapdragon)        (Exynos)        (A, M series)

   Each adds its own CPU core layout, GPU, modem, etc. to build a different chip (SoC)
```

There are two main kinds of licenses.

| License | What you get | Example |
|----------|---------|----|
| Core license | Use a CPU core designed by Arm (e.g. the Cortex series) as is | Many smartphone chips |
| Architecture license | Get only the instruction set and design the CPU core internals yourself | Apple's A and M series chips |

Below is a block diagram of the **Cortex-A8** core, which Arm designed and sold under core licenses. With a 32-bit CPU running the ARMv7 instruction set at the center, it bundles a floating point unit, NEON for multimedia operations, L1 caches split for instructions and data, an L2 cache, and the bus interface into one package. Chip companies take core designs like this and add GPUs, modems, and so on to build their own chips.

![Arm Cortex-A8 core block diagram: ARMv7 32-bit CPU, NEON, floating point unit, L1 instruction and data caches, L2 cache, AMBA3 bus](/images/computer-architecture/arm-cortex-a8-block.jpg)

*Image source: [gyoogle tech interview notes, ARM Processor](https://gyoogle.dev/blog/computer-science/computer-architecture/ARM%20%ED%94%84%EB%A1%9C%EC%84%B8%EC%84%9C.html)*

Note: the Cortex-A8 is an older core announced in 2005. Today's smartphones use 64-bit ARMv8 and ARMv9 based cores, but the basic layout of having compute units and caches together inside the core is similar.

So **even when they use the same ARM instruction set**, each company's internal core design and the parts it adds (GPU, modem, AI accelerator, etc.) differ, resulting in **different chips**. That is why, as a consumer, you can find a wide range of product lines for different uses that are all ARM-based.

### Simple Instructions Make Small Chips

- An architecture is a logical instruction set expressed as a physical circuit. So the more numerous and complex the instructions, the larger and more complex the actual chip structure becomes.
- ARM follows the idea that "a simple instruction set is more efficient," based on its RISC design, so the instruction set and structure themselves are simple.
- A simple instruction set can be implemented with **fewer transistors**, so the design is compact and the chip is smaller.
- A transistor is the basic component of a semiconductor; it uses power and takes up area on the chip (die). So for smartphone or tablet processors, fewer transistors is ideal.

In short, thanks to the chain **fewer instructions → fewer transistors → a small chip with low power consumption**, ARM CPUs are widely used in mobile devices like smartphones and tablets.

In the past, the common view was that "ARM is small and efficient but relatively slow." But today there are many **high-performance ARM chips**, like Apple's M series (MacBooks, since 2020) and Amazon's Graviton (cloud servers), so it is hard to say ARM means slow. Good performance per watt is ARM's biggest strength.

## ARM's Advantage: One Ecosystem

From a consumer's point of view, ARM can be seen as one **ecosystem**.

### Programs Follow the Instruction Set

- An **executable compiled** for ARM runs as is only on devices with an ARM processor. Likewise, an executable built for an x86 CPU won't run as is on an ARM device. This is because the two CPUs understand different instructions (machine code).
- So to run a program that ran on ARM on x86 (or the other way around), you have to **recompile it for that CPU** or modify it.
- There are exceptions, though.
  - Programs that run on an interpreter or virtual machine, like Python, Java, and JavaScript, run on both sides **without changing the code**, as long as that interpreter exists for each CPU.
  - There are also technologies like Apple's Rosetta 2 and Windows emulation that **translate** x86 programs for ARM and run them.

You can check the CPU type of the computer you are using right away with Python.

```python
import platform
print(platform.machine())
```

```text
arm64
```

This is the result on an Apple silicon Mac. On an Intel or AMD CPU, you get `x86_64` or `AMD64`.

### Operating Systems Are Easy to Move Across Devices

- Because they use the same ARM instruction set, an operating system that runs on one ARM device can be **moved relatively easily to other ARM-based devices.** Of course, drivers for the parts that differ by device (screen, camera, modem chip, etc.) still have to be adapted separately.
- Thanks to this advantage, Android could be installed on a huge variety of devices from many manufacturers, and countless versions of Android devices could appear. In the early 2010s, there was even talk of being able to put Android on HP and BlackBerry tablets.
- On the other hand, Apple does not publish the iOS source code or license it to other companies, so even on ARM devices, iOS can't be used anywhere other than Apple devices.

What an operating system does between the hardware and programs is covered in [What Is an Operating System](/en/cs/os/07-운영체제란).

Companies that make ARM chips are still improving their designs in the direction of **lowering power consumption and raising performance**.

## Summary

| Concept | Plain-language summary |
|------|-------------------|
| Processor | A device that executes instructions in memory one at a time |
| ARM | A processor design that uses simple instructions (RISC). Found in most smartphones |
| RISC | A way of working by combining many simple instructions |
| CISC | A way of doing a lot with one complex instruction (e.g. x86) |
| Arm's business model | Doesn't make chips itself; it sells designs, and manufacturers build their own chips |
| Why it's small and low-power | Fewer instructions mean fewer transistors and a smaller chip |
| Executable compatibility | ARM executables can't run as is on x86. They need recompiling or translation |
| Ecosystem advantage | The same instruction set makes it easy to move an OS across many ARM devices |

> Reference: [sergeswin - ARM Processor](https://sergeswin.com/611)
