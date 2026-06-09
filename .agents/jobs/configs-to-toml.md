---
name: configs-to-toml
invariants: 
 - IIPS: Ideal idiomatic principled Syntax [correct and elegant idiomatic prescriptive formation.]
 - $: In-project source module kind
target: $REPO.CODE.web.[config/**, configs]
kind: TRANSFORM
message: 
 - Complete our refactor of thec config system so it uses toml first.
 - take note of the pattern established and fill it in logically according to $IIPS. 
 - wire it up to the to $hooks/useConfig.ts file according to our pattern.
 - integrate all these parts so the routes all render by ensuring they all properly import and use their view and model componenets.
 - log results in vfs in $.agents/logs (here).
---