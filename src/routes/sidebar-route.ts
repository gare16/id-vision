import { LayoutDashboardIcon, ScrollText, Upload, User } from "lucide-react";

export const data = {
  user: {
    name: "garee",
    email: "me@garee.pro",
    avatar: "/avatars/shadcn.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Visitors",
      url: "/visitors",
      icon: User,
    },
    {
      title: "Logs Visitors",
      url: "/logs-visitors",
      icon: ScrollText,
    },
    {
      title: "RFID Tag",
      url: "/rfid-tag",
      icon: ScrollText,
    },
  ],
  documents: [
    {
      name: "Upload Images",
      url: "/uploads",
      icon: Upload,
    },
  ],
};
