import {
  IconBoxModel,
  IconBoxSeam,
  IconCurrencyRupee,
  IconDashboard,
  IconFileText,
  IconHome,
  IconList,
  IconNewSection,
  IconPlus,
  IconStars,
  IconTag,
  IconTruckReturn,
  IconUser,
  IconUsers,
} from '@tabler/icons';
import { Navigate } from 'react-router-dom';

export const actions = [
  {
    title: 'Home',
    description: 'Go to home page / Dashboard',
    link: '/',
    icon: <IconHome size="1.2rem" />,
  },
  {
    title: 'Users',
    description: 'Manage users',
    link: 'users',
    icon: <IconUsers size="1.2rem" />,
  },
  {
    title: 'Create new product',
    description: 'Add a new product',
    link: 'products/add',
    icon: <IconNewSection size="1.2rem" />,
  },
  {
    title: 'Products',
    description: 'View and manage your products',
    link: 'products',
    icon: <IconBoxSeam size="1.2rem" />,
  },
  {
    title: 'Product categories',
    description: 'View and manage your product categories',
    link: 'products/categories',
    icon: <IconTag size="1.2rem" />,
  },
  {
    title: 'Product Reviews',
    description: 'View and manage your product reviews',
    link: 'reviews',
    icon: <IconStars size="1.2rem" />,
  },
  {
    title: 'Stock list',
    description: 'View your inventory stock list',
    link: 'stock-list',
    icon: <IconList size="1.2rem" />,
  },
  {
    title: 'Stock Transfer',
    description: 'Manage stock transfer',
    link: 'stock-transfer',
    icon: <IconList size="1.2rem" />,
  },
  {
    title: 'Invoices',
    description: 'View & Manage your invoices',
    link: 'invoices',
    icon: <IconCurrencyRupee size="1.2rem" />,
  },
  {
    title: 'Create new invoice',
    description: 'Add a new invoice',
    link: 'invoices/add',
    icon: <IconPlus size="1.2rem" />,
  },
  {
    title: 'Orders',
    description: 'View & Manage your orders',
    link: 'orders',
    icon: <IconBoxModel size="1.2rem" />,
  },
  {
    title: 'Returns',
    description: 'View & Manage your stock returns',
    link: 'returns',
    icon: <IconTruckReturn size="1.2rem" />,
  },
];
