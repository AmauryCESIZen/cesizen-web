import { getAllUsers } from "./userService";
import { getAllAdminContents } from "./contentService";
import { getAllCategories } from "./categoryService";
import { getAllPresets } from "./presetService";

export const getDashboardData = async () => {
  const [usersResult, contentsResult, categoriesResult, presetsResult] =
    await Promise.all([
      getAllUsers(),
      getAllAdminContents(),
      getAllCategories(),
      getAllPresets(),
    ]);

  const users = usersResult.data || [];
  const contents = contentsResult.data || [];
  const categories = categoriesResult.data || [];
  const presets = presetsResult.data || [];

  return {
    stats: {
      users: users.length,
      activeUsers: users.filter((user) => user.statut === "ACTIF").length,
      contents: contents.length,
      publishedContents: contents.filter(
        (content) => content.status === "PUBLIE",
      ).length,
      categories: categories.length,
      presets: presets.length,
      activePresets: presets.filter((preset) => preset.actif).length,
    },
    recentUsers: [...users]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5),
    recentContents: [...contents]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5),
  };
};
