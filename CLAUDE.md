# FinanceTracker — Agent Reference

> **Keep this file up to date.** Whenever you add a screen, component, change the theme structure, or alter a dev command, update the relevant section here before finishing the task.

## Dev

```powershell
npm run android          # start Metro + adb reverse + build + install + launch (dev, hot-reload)
npm run android:release  # build release APK (JS bundled inside) + install + launch — no Metro needed
npm test                 # jest
npm run lint             # eslint
```

Rebuilding is only required when: adding native assets (fonts, images), changing android/ files, or installing new packages with native modules. JS/TS changes hot-reload automatically.

---

## Stack

| Layer | Library |
|---|---|
| Framework | React Native 0.85 (New Architecture) |
| Navigation | React Navigation 7 — native stack + bottom tabs |
| Gestures | react-native-gesture-handler + reanimated 4 |
| Storage | @react-native-async-storage/async-storage |
| Database | react-native-quick-sqlite (JSI, synchronous + async) |
| Icons | react-native-vector-icons / MaterialCommunityIcons |
| Font | VT323-Regular (retro pixel font — used on **all** text) |

---

## Project Structure

```
src/
  db/
    database.ts           # initDatabase(), getDatabase() — call initDatabase() once on app launch
    schema.ts             # CREATE TABLE constants; ALL_TABLES = [accounts, categories] only — settings tables managed by migration
    types.ts              # SettingCategory, Setting, SettingsScreenData, Account, Category + input types
    repositories/
      settingsRepository.ts    # getCategories / getCategoryWithSettings / getAllSettingsGrouped / getSetting / getSettingValue<T> / setSetting (editable guard) / resetSetting / resetAllSettings
      accountsRepository.ts    # getAccounts / getAccountById / getAccountByIdentifier / createAccount / updateAccount / archiveAccount
      categoriesRepository.ts  # getCategories / getCategoryById / createCategory / updateCategory / archiveCategory
  theme/
    index.ts          # color tokens, typography, spacing, shadows, borderRadius
    ThemeContext.tsx   # ThemeProvider, useTheme hook source, persists mode to AsyncStorage
    useTheme.ts        # re-exports useTheme()
  components/         # shared UI primitives (see below)
  navigation/
    RootNavigator.tsx  # top-level NavigationContainer + stack
    MainNavigator.tsx  # tab navigator, drawer state, tab↔stack routing (TAB_ROUTES set)
    types.ts           # RootStackParamList, TabParamList, screen prop types (incl. ExpensesScreenProps)
  screens/
    BiometricLock/     # lock screen, navigates → Main on unlock
    Home/              # tab: dashboard — balance, stats, category spend breakdown
    Expenses/          # tab: full transaction list grouped by date, FAB to add
    Settings/
      index.tsx          # terminal header + 2-col CategoryButton grid; loads from getCategories()
      CategoryScreen.tsx # loads via getCategoryWithSettings(); rows driven by input_type from DB
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

## Database

SQLite via `react-native-quick-sqlite`. DB file: `finance_tracker.db`.

**Init:** call `initDatabase()` once at app startup (e.g. in `App.tsx`) before rendering any screen that uses repositories. It is idempotent — safe to call multiple times.

**Usage pattern:**
```ts
import { initDatabase } from './src/db/database'
import { getCategories } from './src/db/repositories/categoriesRepository'

// In App.tsx — already wired. dbReady gate prevents render until DB is open.
await initDatabase()

// Then anywhere:
const categories = await getCategories()
```

**Models:** `SettingCategory`, `Setting`, `SettingsScreenData`, `Account`, `Category` — all in `src/db/types.ts`.  
**Settings schema:** two tables — `settings_categories` (6 rows) + `settings` (rich schema with `input_type`, `data_type`, `options`, `description`). Migration detects old schema by checking for `settings_categories` existence; drops `settings` and recreates both tables on first run.  
**Timestamps:** unix ms (`Date.now()`).  
**Soft deletes:** `is_active = 0` via `archiveAccount` / `archiveCategory`. Active filter must be applied at call site if needed.  
**`archiveCategory(id, reassignTo?)`:** `reassignTo` is wired for future use when a `transactions` table exists; currently only sets `is_active = 0`.

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
| `CategoryRow` | `icon, label, value, total, color, onPress?` | VT block-fill budget bar + icon + spend/budget amounts. `onPress` wraps in TouchableOpacity and shows chevron |
| `CategoryButton` | `label, icon, size, onPress` | Square card for Settings grid; Reanimated CRT flicker animation (scale + opacity + border flash) on press before navigation |
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
  Settings        → category list, back button via Header
  SettingsCategory → detail screen for one category (param: categoryKey: CategoryKey)
```

**AppTopBar** (`src/components/AppTopBar.tsx`): fixed header rendered by `MainNavigator` above the tab navigator — shared by all tab screens. Left = hamburger → opens SideDrawer. Centre = `FINTRACK` wordmark. Right = bell.  
**SideDrawer** (`src/components/SideDrawer.tsx`): left-slide overlay. Nav items: Home, Expenses. Settings section: Settings only. Tab routes use `tabNavRef`; non-tab routes (Settings) go through root stack via `rootNav.navigate()`.  
**Bottom tab bar:** Home (`home-outline`) + Expenses (`receipt`). Retro style: 2px accent bar at top of active tab, VT323 labels. Tab navigation captured via `tabNavRef` in `MainNavigator`.  
**Tab screens** must use `<Screen edges={['bottom', 'left', 'right']}>` — top safe area is handled by AppTopBar.

To add a **tab screen**: (1) create screen (use `edges={['bottom','left','right']}`), (2) add to `TabParamList` in `types.ts`, (3) add to `TAB_CONFIG`, `TAB_ROUTES`, and `<Tab.Screen>` in `MainNavigator.tsx`, (4) add to `NAV_ITEMS` in `SideDrawer.tsx`.  
To add a **stack screen**: (1) create screen, (2) add to `RootStackParamList` in `types.ts`, (3) add `<Stack.Screen>` in `RootNavigator.tsx`.

**Home screen local components:**  
- `StatsRow` — inline component rendering Income / Expenses / Saved stats. No props; reads constants directly.  
- `ExpensesScreen` reads `route.params?.category` via `useRoute` — currently used for the header label; filter logic to be added later.

---

## Fonts

VT323-Regular.ttf is in `android/app/src/main/assets/fonts/`.  
Reference in styles: `fontFamily: 'VT323-Regular'` or via `theme.typography.fonts.retro`.  
Adding a new font requires copying the `.ttf` to the same folder and doing a full rebuild (`npm run android`).
