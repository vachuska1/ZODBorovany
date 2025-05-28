import fs from 'fs/promises';
import path from 'path';

interface MenuFile {
  week: number;
  fileName: string;
  filePath: string;
  cloudinaryUrl: string | null;
  updatedAt: string;
}

const STORAGE_PATH = path.join(process.cwd(), 'data', 'menu-storage.json');

// Initialize storage file if it doesn't exist
async function initStorage() {
  try {
    await fs.mkdir(path.dirname(STORAGE_PATH), { recursive: true });
    try {
      await fs.access(STORAGE_PATH);
    } catch {
      // File doesn't exist, create it
      await fs.writeFile(STORAGE_PATH, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw error;
  }
}

// Read all menu files
async function getMenuFiles(): Promise<MenuFile[]> {
  try {
    await initStorage();
    const data = await fs.readFile(STORAGE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading menu files:', error);
    return [];
  }
}

// Get menu file by week
async function getMenuFile(week: number): Promise<MenuFile | null> {
  const menus = await getMenuFiles();
  return menus.find(menu => menu.week === week) || null;
}

// Save or update menu file
async function saveMenuFile(menu: Omit<MenuFile, 'updatedAt'>): Promise<void> {
  try {
    const menus = await getMenuFiles();
    const existingIndex = menus.findIndex(m => m.week === menu.week);
    
    const menuWithTimestamp = {
      ...menu,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      menus[existingIndex] = menuWithTimestamp;
    } else {
      menus.push(menuWithTimestamp);
    }

    await fs.writeFile(STORAGE_PATH, JSON.stringify(menus, null, 2));
  } catch (error) {
    console.error('Error saving menu file:', error);
    throw error;
  }
}

export { getMenuFiles, getMenuFile, saveMenuFile };
export type { MenuFile };
