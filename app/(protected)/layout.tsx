'use client';
import { useState, useEffect } from 'react';
import { Layout, Menu, Drawer, Spin } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Navbar from '../components/uiComponents/Navbar';

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    const handleLoad = () => setLoading(false); // Hide loader when loaded

    if (document.readyState === 'complete') {
      setLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  const menuItems = [
    { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '2', icon: <AppstoreOutlined />, label: 'Inventory' },
    { key: '3', icon: <UserOutlined />, label: 'Suppliers' },
    { key: '4', icon: <SettingOutlined />, label: 'Settings' },
  ];

  return (
    <>
      {loading ? (
        // Loader while waiting for the page to fully load
        <div className="flex items-center justify-center h-screen w-screen bg-white">
          <Spin size="large" />
        </div>
      ) : (
        <Layout className="min-h-screen">
          {/* Sidebar for Desktop */}
          <Sider trigger={null} collapsible collapsed={collapsed} width={250} className="hidden md:block">
            <div className="h-8 m-4 bg-gray-200 rounded" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={menuItems} />
          </Sider>

          {/* Drawer for Mobile */}
          <Drawer
            title="Menu"
            placement="left"
            closable
            onClose={() => setCollapsed(true)}
            open={!collapsed}
            className="md:hidden"
          >
            <Menu mode="inline" defaultSelectedKeys={['1']} items={menuItems} />
          </Drawer>

          <Layout>
            <Header className="p-0 bg-white">
              <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
            </Header>
            <Content className="mx-4 my-6 p-6 min-h-[280px]">{children}</Content>
          </Layout>
        </Layout>
      )}
    </>
  );
}
