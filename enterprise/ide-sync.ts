// Compound Engineering Plugin — Enterprise Sync Layer
// Syncs enterprise context across Claude Code + Cursor + other IDEs
// Ensures agents in any IDE see the same KB context and can report to the same queue

import EnterpriseKB from '../enterprise/kb-client.js';

const kb = new EnterpriseKB();

interface IDEContext {
  ide: 'claude-code' | 'cursor' | 'windsurf' | 'other';
  project?: string;
  file?: string;
  language?: string;
}

/**
 * Enterprise context provider for the Compound Engineering Plugin.
 * Called by each IDE plugin to inject enterprise KB context.
 */
async function getEnterpriseContext(ideContext: IDEContext): Promise<string> {
  try {
    const healthy = await kb.healthCheck();
    if (!healthy) return '';

    const parts: string[] = [];

    // 1. Get auto-inject items (always-on context)
    const autoItems = await kb.getAutoInjectItems();
    if (autoItems.length > 0) {
      parts.push(
        '## Enterprise Context (Auto-Inject)',
        ...autoItems.slice(0, 5).map(i =>
          `- **${i.title}**: ${(i.content_plain || i.content).slice(0, 200)}`
        )
      );
    }

    // 2. Get project-specific KB if project name matches
    if (ideContext.project) {
      const projectItems = await kb.searchKB(ideContext.project, 3);
      if (projectItems.length > 0) {
        parts.push(
          `## Project Context: ${ideContext.project}`,
          ...projectItems.map(i =>
            `- **${i.title}** [${i.tags.join(', ')}]: ${(i.content_plain || i.content).slice(0, 200)}`
          )
        );
      }
    }

    // 3. Active enterprise agents
    const agents = await kb.getAgentsByStatus('active');
    if (agents.length > 0) {
      parts.push(
        `## Active Enterprise Agents (${agents.length})`,
        ...agents.slice(0, 8).map(a => `- ${a.name}: ${a.description?.slice(0, 80)}`)
      );
    }

    return parts.length > 0 ? parts.join('\n') : '';
  } catch {
    return '';
  }
}

/**
 * Report IDE activity to enterprise tracking
 */
async function reportIDEActivity(
  ide: string,
  action: string,
  details: { tokens_input?: number; tokens_output?: number; model?: string }
): Promise<void> {
  try {
    const agent = await kb.findAgent(
      ide === 'claude-code' ? 'OMC Orchestrator' : 'OMX Orchestrator'
    );
    if (!agent) return;

    if (details.tokens_input || details.tokens_output) {
      const cost = EnterpriseKB.calculateCost(
        details.model || 'sonnet',
        details.tokens_input || 0,
        details.tokens_output || 0
      );
      await kb.logTokenUsage({
        agent_id: agent.id,
        model: details.model || 'unknown',
        input_tokens: details.tokens_input || 0,
        output_tokens: details.tokens_output || 0,
        estimated_cost_usd: cost,
      });
    }
  } catch {}
}

export { getEnterpriseContext, reportIDEActivity };
export default getEnterpriseContext;