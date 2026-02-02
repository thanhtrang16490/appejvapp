import { Redirect } from 'expo-router';

export default function Index() {
  // Chuyển hướng người dùng đến trang tabs
  return <Redirect href="/(tabs)" />;
}
