import type { ThemeConfig } from 'antd';
import { theme } from 'antd';


// Define your theme customization
const themeCustomize: ThemeConfig = {
  token: {
    fontSize: 16,
    colorPrimary: '#52c41a',
  },
  algorithm: [theme.darkAlgorithm,theme.compactAlgorithm]
};

export default themeCustomize;