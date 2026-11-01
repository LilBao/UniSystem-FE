import api from './api';
import {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
  AuthTokenResponse,
  UserProfileResponse,
  UserResponse,
  PermissionMatrixResponse,
  PermissionCheckRequest,
  PermissionCheckResponse,
  UpdateGlobalRoleRequest,
  AssignCourseRoleRequest,
  CourseMembershipResponse,
  AssignGroupRoleRequest,
  GroupMembershipResponse,
} from '@/types';

const STORAGE_ACCESS_TOKEN = 'access_token';
const STORAGE_REFRESH_TOKEN = 'refresh_token';
const STORAGE_USER_PROFILE = 'unisystem_user';

export const authService = {
  async register(body: RegisterRequest): Promise<AuthTokenResponse> {
    const response = await api.post<AuthTokenResponse>('/api/v1/auth/register', body);
    this.persistSession(response.data);
    return response.data;
  },

  async login(body: LoginRequest): Promise<AuthTokenResponse> {
    const response = await api.post<AuthTokenResponse>('/api/v1/auth/login', body);
    this.persistSession(response.data);
    return response.data;
  },

  async refreshToken(body: RefreshTokenRequest): Promise<AuthTokenResponse> {
    const response = await api.post<AuthTokenResponse>('/api/v1/auth/refresh', body);
    this.persistSession(response.data);
    return response.data;
  },

  async getMe(): Promise<UserProfileResponse> {
    const response = await api.get<UserProfileResponse>('/api/v1/auth/me');
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_USER_PROFILE, JSON.stringify(response.data));
    }
    return response.data;
  },

  async changePassword(body: ChangePasswordRequest): Promise<UserResponse> {
    const response = await api.post<UserResponse>('/api/v1/auth/change-password', body);
    return response.data;
  },

  async getPermissionMatrix(): Promise<PermissionMatrixResponse> {
    const response = await api.get<PermissionMatrixResponse>(
      '/api/v1/auth/permissions/matrix'
    );
    return response.data;
  },

  async checkPermission(body: PermissionCheckRequest): Promise<PermissionCheckResponse> {
    const response = await api.post<PermissionCheckResponse>(
      '/api/v1/auth/permissions/check',
      body
    );
    return response.data;
  },

  async updateUserGlobalRole(
    userId: string,
    body: UpdateGlobalRoleRequest
  ): Promise<UserResponse> {
    const response = await api.patch<UserResponse>(
      `/api/v1/auth/users/${userId}/role`,
      body
    );
    return response.data;
  },

  async assignCourseRole(
    courseId: string,
    userId: string,
    body: AssignCourseRoleRequest
  ): Promise<CourseMembershipResponse> {
    const response = await api.put<CourseMembershipResponse>(
      `/api/v1/auth/courses/${courseId}/memberships/${userId}`,
      body
    );
    return response.data;
  },

  async removeCourseMember(courseId: string, userId: string): Promise<void> {
    await api.delete(`/api/v1/auth/courses/${courseId}/memberships/${userId}`);
  },

  async assignGroupRole(
    projectId: string,
    groupId: string,
    userId: string,
    body: AssignGroupRoleRequest
  ): Promise<GroupMembershipResponse> {
    const response = await api.put<GroupMembershipResponse>(
      `/api/v1/auth/projects/${projectId}/groups/${groupId}/members/${userId}`,
      body
    );
    return response.data;
  },

  async removeGroupMember(
    projectId: string,
    groupId: string,
    userId: string
  ): Promise<void> {
    await api.delete(
      `/api/v1/auth/projects/${projectId}/groups/${groupId}/members/${userId}`
    );
  },

  persistSession(tokenData: AuthTokenResponse, fullProfile?: UserProfileResponse) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_ACCESS_TOKEN, tokenData.access_token);
    localStorage.setItem(STORAGE_REFRESH_TOKEN, tokenData.refresh_token);
    const profileToStore: UserProfileResponse = fullProfile || {
      ...tokenData.user,
      course_memberships: [],
      group_memberships: [],
    };
    localStorage.setItem(STORAGE_USER_PROFILE, JSON.stringify(profileToStore));
  },

  getStoredProfile(): UserProfileResponse | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_USER_PROFILE);
      return raw ? (JSON.parse(raw) as UserProfileResponse) : null;
    } catch {
      return null;
    }
  },

  hasToken(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(localStorage.getItem(STORAGE_ACCESS_TOKEN));
  },

  logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_USER_PROFILE);
  },
};
