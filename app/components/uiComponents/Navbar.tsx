"use client";
import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Input, Avatar, Badge, Button } from "antd";

export default function Navbar({ collapsed, setCollapsed }: any) {
  return (
    <div className="flex items-center justify-self-end px-4 h-16">
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className="text-lg w-16 md:hidden" // Hide button on desktop
      />

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          className="inline-block w-48 md:inline-flex p-2"
        />

        <Badge count={5} className="cursor-pointer">
          <BellOutlined className="text-xl" />
        </Badge>

        <Avatar
          size="large"
          icon={<UserOutlined />}
          className="bg-blue-500 cursor-pointer"
        />
      </div>
    </div>
  );
}
