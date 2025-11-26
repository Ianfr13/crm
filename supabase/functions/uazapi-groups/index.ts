/**
 * Edge Function: Grupos e Comunidades
 * Endpoints: 17 (list, get, create, update, delete, leave, add_member, remove_member, promote, demote, list_members, invite_link, revoke_invite, create_community, list_communities, add_subgroup, remove_subgroup)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getAuthContext, corsHeaders, errorResponse, successResponse, corsResponse } from "../_shared/shared-utils.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return corsResponse();
  }

  try {
    const auth = await getAuthContext(req);
    if (!auth) {
      return errorResponse('Unauthorized', 401);
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const { method } = req;

    // ==================== GRUPOS ====================

    // LIST GROUPS
    if (method === 'GET' && action === 'list_groups') {
      const result = await auth.uazapi.listGroups(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // GET GROUP
    if (method === 'GET' && action === 'get_group') {
      const group_id = url.searchParams.get('group_id') || '';
      const result = await auth.uazapi.getGroup(auth.instanceName, group_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // CREATE GROUP
    if (method === 'POST' && action === 'create_group') {
      const { subject, participants } = await req.json();
      const result = await auth.uazapi.createGroup(auth.instanceName, subject, participants);
      return successResponse(result, result.success ? 200 : 400);
    }

    // UPDATE GROUP
    if (method === 'POST' && action === 'update_group') {
      const { group_id, ...updates } = await req.json();
      const result = await auth.uazapi.updateGroup(auth.instanceName, group_id, updates);
      return successResponse(result, result.success ? 200 : 400);
    }

    // DELETE GROUP
    if (method === 'DELETE' && action === 'delete_group') {
      const group_id = url.searchParams.get('group_id') || '';
      const result = await auth.uazapi.deleteGroup(auth.instanceName, group_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // LEAVE GROUP
    if (method === 'POST' && action === 'leave_group') {
      const { group_id } = await req.json();
      const result = await auth.uazapi.leaveGroup(auth.instanceName, group_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // ADD GROUP MEMBER
    if (method === 'POST' && action === 'add_group_member') {
      const { group_id, number } = await req.json();
      const result = await auth.uazapi.addGroupMember(auth.instanceName, group_id, number);
      return successResponse(result, result.success ? 200 : 400);
    }

    // REMOVE GROUP MEMBER
    if (method === 'POST' && action === 'remove_group_member') {
      const { group_id, number } = await req.json();
      const result = await auth.uazapi.removeGroupMember(auth.instanceName, group_id, number);
      return successResponse(result, result.success ? 200 : 400);
    }

    // PROMOTE GROUP MEMBER
    if (method === 'POST' && action === 'promote_group_member') {
      const { group_id, number } = await req.json();
      const result = await auth.uazapi.promoteGroupMember(auth.instanceName, group_id, number);
      return successResponse(result, result.success ? 200 : 400);
    }

    // DEMOTE GROUP MEMBER
    if (method === 'POST' && action === 'demote_group_member') {
      const { group_id, number } = await req.json();
      const result = await auth.uazapi.demoteGroupMember(auth.instanceName, group_id, number);
      return successResponse(result, result.success ? 200 : 400);
    }

    // LIST GROUP MEMBERS
    if (method === 'GET' && action === 'list_group_members') {
      const group_id = url.searchParams.get('group_id') || '';
      const result = await auth.uazapi.listGroupMembers(auth.instanceName, group_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // GET GROUP INVITE LINK
    if (method === 'GET' && action === 'get_group_invite_link') {
      const group_id = url.searchParams.get('group_id') || '';
      const result = await auth.uazapi.getGroupInviteLink(auth.instanceName, group_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // REVOKE GROUP INVITE LINK
    if (method === 'POST' && action === 'revoke_group_invite_link') {
      const { group_id } = await req.json();
      const result = await auth.uazapi.revokeGroupInviteLink(auth.instanceName, group_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // ==================== COMUNIDADES ====================

    // CREATE COMMUNITY
    if (method === 'POST' && action === 'create_community') {
      const { subject, description } = await req.json();
      const result = await auth.uazapi.createCommunity(auth.instanceName, subject, description);
      return successResponse(result, result.success ? 200 : 400);
    }

    // LIST COMMUNITIES
    if (method === 'GET' && action === 'list_communities') {
      const result = await auth.uazapi.listCommunities(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // ADD SUBGROUP TO COMMUNITY
    if (method === 'POST' && action === 'add_subgroup_to_community') {
      const { community_id, group_id } = await req.json();
      const result = await auth.uazapi.addSubgroupToCommunity(auth.instanceName, community_id, group_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // REMOVE SUBGROUP FROM COMMUNITY
    if (method === 'POST' && action === 'remove_subgroup_from_community') {
      const { community_id, group_id } = await req.json();
      const result = await auth.uazapi.removeSubgroupFromCommunity(auth.instanceName, community_id, group_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
