import type { Script, ScriptNode } from "./types";

export function getNodeById(script: Script, nodeId: string): ScriptNode | undefined {
  return script.nodes.find((n) => n.id === nodeId);
}

export function getStartNode(script: Script): ScriptNode | undefined {
  return getNodeById(script, script.start);
}
