---
title: Clean Architecture Highlights
date: 2026-03-14
tags: [architecture, clean architecture, software development, software engineering, design patterns]
status: publish
type: post
published: true
meta:
  _edit_last: '1'
---

As projects grow, architecture problems tend to show up as change-management problems. A new feature takes too long to ship, a bug fix triggers unrelated regressions, or onboarding a new contributor requires a long explanation of where logic is allowed to live.

I recently revisited *Clean Architecture* by Robert C. Martin and found it useful less as a prescription and more as a checklist of pressures that show up in long-lived systems. Not every project needs strict layering or a textbook implementation of the patterns in the book, but many of the underlying ideas hold up well.

These are the parts I think are most practical.

## Programming Paradigms Are Constraints

One of the more useful observations in the book is that major programming paradigms are best understood as restrictions rather than superpowers.

- Structured programming limits arbitrary control flow.
- Object-oriented programming limits dependency direction through abstraction and polymorphism.
- Functional programming limits shared mutable state.

That framing matters because architecture works the same way. A good architecture limits how easily concerns can bleed into each other. It does not eliminate bad decisions, but it makes the codebase more resistant to them.

## Architecture Is About Change

Architecture is often discussed in terms of diagrams, layers, or purity. In practice, I think it is more useful to think about it in terms of change. A healthy system keeps important decisions reversible for as long as possible.

That includes decisions such as:

- which database to use
- which web framework to use
- whether the system is exposed through a web app, API, CLI, or mobile client

Those choices matter, but they should not define the core of the system. If changing a database requires rewriting business rules, or changing a UI requires redesigning domain behavior, the boundaries are probably in the wrong place.

## The Dependency Rule

One of the most practical ideas in the book is the dependency rule: source code dependencies should point inward, toward higher-level policies, and not outward toward implementation details.

That means the parts of the system that represent core business rules should not know about:

- frameworks
- databases
- HTTP
- ORMs
- UI libraries

Instead, outer layers depend on inner layers. The application core defines use cases and interfaces, while infrastructure and delivery mechanisms plug into those abstractions.

This can sound academic until the opposite starts happening. Once domain logic imports controller code, SQL models, or framework-specific request objects, everything becomes harder to test, reuse, and reason about. The system starts to feel less like a set of layers and more like a pile of cross-references.

## Boundaries Are a Tool, Not Ceremony

A boundary is simply a line that says, "Changes on one side should have limited impact on the other side."

Healthy boundaries let us isolate concerns such as:

- business rules versus presentation
- use cases versus persistence
- policy versus mechanism

Not every project needs many physical layers, separate repositories, or a collection of microservices. In smaller systems, a boundary may be nothing more than a few interfaces, a dedicated module, or a disciplined directory structure. The point is not to maximize indirection. The point is to keep change local.

That is also why partial boundaries can be valuable. Even if a project is too small to justify full separation today, introducing clear abstractions can prevent the design from collapsing as the codebase grows.

## Good Architecture Starts With Cohesion

The component principles in the book are also useful when deciding how to split a system into modules. Related code should move together, change together, and make sense together.

When a component mixes unrelated responsibilities, teams usually pay for it in one of two ways:

- it becomes a dumping ground that everyone is afraid to touch
- it changes constantly for unrelated reasons, creating merge conflicts and accidental regressions

High cohesion makes ownership easier. It also makes reviews easier, testing more targeted, and onboarding faster because the shape of the system starts to communicate intent.

## Stability and Abstraction Need Balance

Another useful point is that stable components should also be abstract enough to absorb change. If a module has many dependents, changing it becomes expensive. Highly stable modules should expose carefully designed abstractions instead of brittle concrete details.

This is especially important in shared libraries, core domain packages, and widely used application services. When these modules leak implementation assumptions, they force downstream code to mirror those assumptions. That makes the whole system more rigid.

The practical takeaway is simple: the more central a module is, the more deliberate its public API should be.

## Design for Testability

One reliable sign of architectural quality is whether important behavior can be tested without booting the whole world.

If validating a pricing rule requires a running web server, a real database, and several framework objects, then the design is telling us something. The code under test is too entangled with delivery and infrastructure concerns.

The book argues for shaping use cases so they can be exercised as plain application logic. That does not eliminate integration tests, but it does mean the most important rules in the system can be verified quickly and directly.

This has a compounding effect. Fast, focused tests make refactoring safer. Safer refactoring makes design improvements more likely. Better design makes future tests easier to write.

## Frameworks Are Details

This is probably the hardest lesson to apply because frameworks are often the most visible part of a codebase. They generate files, define conventions, and influence how teams think about structure. It is easy to let the framework become the architecture.

But frameworks are tools. They are not the product, and they are not the business model.

The same applies to databases, messaging systems, and UI technology. They are important details, but still details. A system should be able to describe its core purpose without naming its web framework, persistence layer, or frontend stack.

If the first thing your codebase "says" is the framework it uses, rather than the problem it solves, the architecture may not be screaming the right thing.

## What I Try to Apply in Practice

The practical habits this pushes me toward are straightforward:

- keep business rules isolated from delivery and storage concerns
- depend on abstractions at the boundaries
- organize modules around use cases and domain concepts
- make important logic easy to test without infrastructure
- treat frameworks as replaceable tools, not the center of the design

I do not think every project needs a perfect layered diagram or a textbook implementation of clean architecture. But almost every long-lived project benefits from asking a few uncomfortable questions:

- What part of this code is the actual policy?
- What part is just mechanism?
- Which dependencies are we taking that we do not really need?
- If we changed our UI or persistence layer, what would break?

Those questions tend to reveal whether architecture is helping the team move faster or quietly making the next change more expensive.

## Final Thoughts

The main value I get from *Clean Architecture* is not a specific folder structure or pattern. It is the reminder that software design should protect the things that matter most from the things that change most often.

When a codebase makes it easy to onboard contributors, evolve features, and test core behavior in isolation, architecture is doing its job. When every change ripples outward unpredictably, architecture is already part of the problem.

That is the part of the book I find most useful. It is not really about purity; it is about keeping the center of the system stable enough that change remains possible.
