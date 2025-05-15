'use client';

import { useContext } from 'react';
import { useAuthRedirect } from '@/hook/useAuthRedirect';
import { AuthContext } from '@/context/AuthContext';

export default function DashboardPage() {
  const { token } = useContext(AuthContext)!;
  useAuthRedirect(token);

  return <div>Chào mừng đến trang Dashboard!</div>;
}