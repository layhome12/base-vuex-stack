type SidebarChild = {
  key: string;
  parent_key: string | null;
  name: string;
  icon: string;
  route: string;
  seq: number;
};

type SidebarItem = SidebarChild & {
  childs: SidebarChild[];
};

type AccessGroup = {
  group_id: number;
  sidebar_key: string;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
};
