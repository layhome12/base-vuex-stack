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