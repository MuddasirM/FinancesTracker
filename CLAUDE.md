# FinanceTracker — Agent Reference

> **Keep this file up to date.** Whenever you add a screen, component, change the theme structure, or alter a dev command, update the relevant section here before finishing the task.

## Dev

```powershell
npm run android   # start Metro + adb reverse + build + install + launch (one command)
npm test          # jest
npm run lint      # eslint
```

Rebuilding is only required when: adding native assets (fonts, images), changing android/ files, or installing new packages with native modules. JS/TS changes hot-reload automatically.

---

## Stack

| Layer | Library |
|---|---|
| Framework | React Native 0.85 (New Architecture) |
| Navigation | React Navigation 7 — native stack + (bottom tabs reserved) |
| Gestures | react-native-gesture-handler + reanimated 4 |
| Storage | @react-native-async-storage/async-storage |
| Icons | react-native-vector-icons / MaterialCommunityIcons |
| Font | VT323-Regular (retro pixel font — used on **all** text) |

---

## Project Structure

```
src/
  theme/
    index.ts          # color tokens, typography, spacing, shadows, borderRadius
    ThemeContext.tsx   # ThemeProvider, useTheme hook source, persists mode to AsyncStorage
    useTheme.ts        # re-exports useTheme()
  components/         # shared UI primitives (see below)
  navigation/
    RootNavigator.tsx  # top-level NavigationContainer + stack
    types.ts           # RootStackParamList + screen prop types
  screens/
    BiometricLock/     # lock screen, navigates → Main on unlock
    Home/              # tab: dashboard — balance, stats, category spend breakdown
    Expenses/          # tab: full transaction list grouped by date, FAB to add
    Settings/          # root stack screen — opened from SideDrawer, has back button
android/
  app/src/main/assets/fonts/   # VT323-Regular.ttf lives here
```

---

## Theme

Configured in `src/theme/index.ts`. Dark mode is the current target.

```ts
// Key dark palette
background.primary   '#0D0B08'  // warm near-black
background.secondary '#151210'
background.card      '#1C1916'
accent.primary       '#C9A87C'  // beige — main accent
text.primary         '#F0EAE0'  // warm off-white
border               '#222222'

// Typography
typography.fonts.retro  'VT323-Regular'  // apply to all text
```

Default theme mode is `'dark'` (set in ThemeContext). User preference is persisted via AsyncStorage key `@ft_theme_preference`. Change default in `ThemeContext.tsx` line with `useState<ThemeMode>('dark')`.

**Design language:** retro/terminal aesthetic — sharp corners (`borderRadius` 0–4), 1px visible borders on all cards/inputs, hard offset shadows (`shadowRadius: 0, offset: 3×3`) tinted with the beige accent, VT323 on all text.

---

## Components

All in `src/components/`. All consume theme via `useTheme()`.

| Component | Key Props | Notes |
|---|---|---|
| `Screen` | `children, style, contentStyle, edges` | SafeAreaView wrapper, handles StatusBar. Tab screens pass `edges={['bottom','left','right']}` |
| `ScrollScreen` | same as Screen | ScrollView version of Screen |
| `AppTopBar` | `onMenuPress` | Fixed top bar rendered by MainNavigator — do not add to individual screens |
| `SideDrawer` | `visible, onClose, activeRoute, onNavigate` | Left-slide overlay with nav + settings links |
| `Text` | `variant, color, style` | Variants: `heading` `subheading` `body` `caption` `label` — all use VT323-Regular |
| `Card` | `padding, elevated, accent` | `accent` adds 3px left beige stripe |
| `Button` | `label, onPress, variant, icon, loading, disabled, fullWidth` | Variants: `primary` `secondary` `ghost` `danger`. Press-down animation shifts button 2px |
| `Input` | `label, error, leftIcon, rightIcon, large` | Left accent stripe on focus, 2px border on focus/error |
| `Badge` | `label, variant` | Variants: `auto` `manual` `untagged` `default` `success` `danger` `warning`. Bordered rectangle, no fill |
| `ListItem` | `title, subtitle, leftIcon, rightElement, onPress, showDivider, active` | `active` adds left accent stripe |
| `Header` | `title, onBack, rightAction, rightElement, borderless` | 2px bottom border, uppercase spaced title |
| `FAB` | `onPress, iconName, bottom, right` | Square, beige hard shadow, press-down animation |
| `BottomSheet` | `visible, onDismiss, snapHeight, scrollable` | Accent top border, animated slide-up |
| `EmptyState` | `icon, title, subtitle, ctaLabel, onCta` | Uppercase title, decorative beige rule |

---

## Navigation

```
RootStack (initialRoute: BiometricLock)
  BiometricLock   → replace('Main') on unlock
  Main            → MainNavigator
    AppTopBar     (fixed across all tab screens)
    Tab.Navigator
      Home
      Expenses
    SideDrawer    (overlay, opened by hamburger)
  Settings        → full screen, back button via Header
```

**AppTopBar** (`src/components/AppTopBar.tsx`): fixed header rendered by `MainNavigator` above the tab navigator — shared by all tab screens. Left = hamburger → opens SideDrawer. Centre = `FINTRACK` wordmark. Right = bell.  
**SideDrawer** (`src/components/SideDrawer.tsx`): left-slide overlay. Nav items: Home, Expenses. Settings section: Settings, Help. Settings lives in the drawer, not a tab.  
**Bottom tab bar:** Home (`home-outline`) + Expenses (`receipt-text`). Retro style: 2px accent bar at top of active tab, VT323 labels. Tab navigation is captured via `tabNavRef` in `MainNavigator` and shared with the drawer.  
**Tab screens** must use `<Screen edges={['bottom', 'left', 'right']}>` — top safe area is handled by AppTopBar.

To add a **tab screen**: (1) create screen (use `edges={['bottom','left','right']}`), (2) add to `TabParamList` in `types.ts`, (3) add to `TAB_CONFIG` + `<Tab.Screen>` in `MainNavigator.tsx`, (4) add to `NAV_ITEMS` in `SideDrawer.tsx`.  
To add a **stack screen** (modal etc): (1) create screen, (2) add to `RootStackParamList` in `types.ts`, (3) add `<Stack.Screen>` in `RootNavigator.tsx`.

---

## Fonts

VT323-Regular.ttf is in `android/app/src/main/assets/fonts/`.  
Reference in styles: `fontFamily: 'VT323-Regular'` or via `theme.typography.fonts.retro`.  
Adding a new font requires copying the `.ttf` to the same folder and doing a full rebuild (`npm run android`).
