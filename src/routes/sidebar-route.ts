import {
  LayoutDashboardIcon,
  ScrollText,
  Tag,
  Upload,
  User,
} from "lucide-react";

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
      isActive: false,
    },
    {
      title: "Visitors",
      url: "/visitors",
      icon: User,
      isActive: false,
    },
    {
      title: "Logs Visitors",
      url: "/logs-visitors",
      icon: ScrollText,
      isActive: false,
    },
    {
      title: "RFID Tag",
      url: "/rfid-tag",
      icon: Tag,
      isActive: true,
      items: [
        {
          title: "List RFID Tag",
          url: "/rfid-tag",
        },
        {
          title: "Check RFID",
          url: "/check-rfid",
        },
      ],
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
