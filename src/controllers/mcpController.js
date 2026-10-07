import { supabase } from '../config/supabase.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * POST /api/mcp
 * Web Model Context Protocol (MCP) Tool Execution Endpoint
 * Replicates the exact AI integration from Glossy Woods: search_shop_policies_and_faqs
 */
export const handleMcp = async (req, res, next) => {
  try {
    const { name, query, context } = req.body;

    // Check if this is an MCP tool call
    const toolName = name || 'search_shop_policies_and_faqs';
    const searchQuery = (query || req.body?.arguments?.query || '').trim();

    if (!searchQuery) {
      return errorResponse(res, 'Missing search query', null, 400);
    }

    // 1. Search policies in Supabase
    const { data: policies } = await supabase
      .from('store_policies')
      .select('type, title, content')
      .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);

    // 2. Search FAQs in Supabase
    const { data: faqs } = await supabase
      .from('store_faqs')
      .select('question, answer, category')
      .or(`question.ilike.%${searchQuery}%,answer.ilike.%${searchQuery}%`);

    // 3. Construct intelligent context response
    const results = [];

    if (policies && policies.length > 0) {
      policies.forEach(p => {
        results.push(`[Policy: ${p.title}]\n${p.content}`);
      });
    }

    if (faqs && faqs.length > 0) {
      faqs.forEach(f => {
        results.push(`[FAQ: ${f.question}]\n${f.answer}`);
      });
    }

    const outputText = results.length > 0
      ? results.join('\n\n')
      : `Woody Home provides handcrafted wooden décor with 3-5 days delivery across Pakistan via COD. For assistance, reach customer care on WhatsApp at +923326457322.`;

    return successResponse(res, 'MCP query executed', {
      tool: toolName,
      query: searchQuery,
      result: outputText,
      matches: {
        policies: policies || [],
        faqs: faqs || []
      }
    });
  } catch (err) {
    next(err);
  }
};
