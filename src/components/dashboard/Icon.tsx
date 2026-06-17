import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Flame,
  Home,
  Locate,
  MapPin,
  Map,
  Maximize2,
  Megaphone,
  Menu,
  MessageCircle,
  Mic,
  Minus,
  Plus,
  Presentation,
  Route,
  Search,
  Send,
  Settings,
  Sparkles,
  Tag,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

const registry: Record<string, LucideIcon> = {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Flame,
  Home,
  Locate,
  MapPin,
  Map,
  Maximize2,
  Megaphone,
  Menu,
  MessageCircle,
  Mic,
  Minus,
  Plus,
  Presentation,
  Route,
  Search,
  Send,
  Settings,
  Sparkles,
  Tag,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
};

export interface IconProps {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

/** Renders a lucide icon by name. Thin strokes by default for a premium feel. */
export function Icon({ name, className, size = 20, strokeWidth = 1.75 }: IconProps) {
  const Cmp = registry[name] ?? Sparkles;
  return <Cmp className={className} size={size} strokeWidth={strokeWidth} />;
}
