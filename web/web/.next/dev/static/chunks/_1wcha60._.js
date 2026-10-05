(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/AppNavSidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppNavSidebar",
    ()=>AppNavSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CourseSidebarNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CourseSidebarNav.tsx [app-client] (ecmascript)");
"use client";
;
;
function AppNavSidebar() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "app-nav-sidebar hidden lg:flex flex-col fixed left-0 top-0 z-40 h-screen w-[var(--nav-sidebar-w)] border-r border-border bg-background",
        "aria-label": "Navegação",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CourseSidebarNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CourseSidebarNav"], {}, void 0, false, {
            fileName: "[project]/components/AppNavSidebar.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/AppNavSidebar.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = AppNavSidebar;
var _c;
__turbopack_context__.k.register(_c, "AppNavSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/AppShell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppShell",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppNavSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AppNavSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CommandMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CommandMenu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ProgressProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ProgressProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScrollToTop$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ScrollToTop.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SiteHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SiteHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$sidebar$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/sidebar-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function AppShell({ children }) {
    _s();
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const isLogin = path === "/login" || path === "/acesso-restrito";
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [commandOpen, setCommandOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppShell.useEffect": ()=>{
            setOpen(false);
        }
    }["AppShell.useEffect"], [
        path
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppShell.useEffect": ()=>{
            document.body.classList.toggle("sidebar-open", open);
            if (!open) return;
            const onKey = {
                "AppShell.useEffect.onKey": (e)=>{
                    if (e.key === "Escape") setOpen(false);
                }
            }["AppShell.useEffect.onKey"];
            window.addEventListener("keydown", onKey);
            return ({
                "AppShell.useEffect": ()=>{
                    window.removeEventListener("keydown", onKey);
                    document.body.classList.remove("sidebar-open");
                }
            })["AppShell.useEffect"];
        }
    }["AppShell.useEffect"], [
        open
    ]);
    const toggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppShell.useCallback[toggle]": ()=>setOpen({
                "AppShell.useCallback[toggle]": (v)=>!v
            }["AppShell.useCallback[toggle]"])
    }["AppShell.useCallback[toggle]"], []);
    const toggleCommand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppShell.useCallback[toggleCommand]": ()=>setCommandOpen({
                "AppShell.useCallback[toggleCommand]": (v)=>!v
            }["AppShell.useCallback[toggleCommand]"])
    }["AppShell.useCallback[toggleCommand]"], []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AppShell.useMemo[value]": ()=>({
                open,
                setOpen,
                toggle,
                commandOpen,
                setCommandOpen,
                toggleCommand
            })
    }["AppShell.useMemo[value]"], [
        open,
        toggle,
        commandOpen,
        toggleCommand
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ProgressProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProgressProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$sidebar$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarContext"].Provider, {
            value: value,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScrollToTop$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollToTop"], {}, void 0, false, {
                    fileName: "[project]/components/AppShell.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CommandMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandMenu"], {
                    open: commandOpen,
                    onOpenChange: setCommandOpen
                }, void 0, false, {
                    fileName: "[project]/components/AppShell.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this),
                isLogin ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "app-shell login-shell",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "app-main",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/components/AppShell.tsx",
                        lineNumber: 57,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/AppShell.tsx",
                    lineNumber: 56,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "app-shell hi-shell",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppNavSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppNavSidebar"], {}, void 0, false, {
                            fileName: "[project]/components/AppShell.tsx",
                            lineNumber: 61,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "app-content-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SiteHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SiteHeader"], {}, void 0, false, {
                                    fileName: "[project]/components/AppShell.tsx",
                                    lineNumber: 63,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                                    className: "app-main",
                                    children: children
                                }, void 0, false, {
                                    fileName: "[project]/components/AppShell.tsx",
                                    lineNumber: 64,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AppShell.tsx",
                            lineNumber: 62,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AppShell.tsx",
                    lineNumber: 60,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/AppShell.tsx",
            lineNumber: 52,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/AppShell.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_s(AppShell, "ZS2t0VA12nt2tApI7wMH1bje0Dc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AppShell;
var _c;
__turbopack_context__.k.register(_c, "AppShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/CommandMenu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CommandMenu",
    ()=>CommandMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/command.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$categories$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/content/categories.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$articles$2f$index$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/content/articles/index.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/compass.mjs [app-client] (ecmascript) <export default as Compass>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.mjs [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.mjs [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.mjs [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.mjs [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.mjs [app-client] (ecmascript) <export default as Users>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const CATEGORIES = __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$categories$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
const LEARN = CATEGORIES.filter(_c = (c)=>c.navGroup === "learn-primary" || c.navGroup === "learn-secondary");
_c1 = LEARN;
const QUIZ = CATEGORIES.filter(_c2 = (c)=>c.hasQuiz && !c.stub);
_c3 = QUIZ;
const ARTICLES = __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$articles$2f$index$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
function CommandMenu({ open: controlledOpen, onOpenChange: setControlledOpen }) {
    _s();
    const [internalOpen, setInternalOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "CommandMenu.useCallback[setOpen]": (nextOpen)=>{
            if (isControlled && setControlledOpen) {
                setControlledOpen(nextOpen);
            } else {
                setInternalOpen(nextOpen);
            }
        }
    }["CommandMenu.useCallback[setOpen]"], [
        isControlled,
        setControlledOpen
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "CommandMenu.useEffect": ()=>{
            const down = {
                "CommandMenu.useEffect.down": (e)=>{
                    if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        setOpen(!open);
                    }
                }
            }["CommandMenu.useEffect.down"];
            document.addEventListener("keydown", down);
            return ({
                "CommandMenu.useEffect": ()=>document.removeEventListener("keydown", down)
            })["CommandMenu.useEffect"];
        }
    }["CommandMenu.useEffect"], [
        open,
        setOpen
    ]);
    const runCommand = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "CommandMenu.useCallback[runCommand]": (command)=>{
            setOpen(false);
            command();
        }
    }["CommandMenu.useCallback[runCommand]"], [
        setOpen
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandDialog"], {
        open: open,
        onOpenChange: setOpen,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandInput"], {
                placeholder: "Buscar em Aprender, Praticar e artigos..."
            }, void 0, false, {
                fileName: "[project]/components/CommandMenu.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandList"], {
                className: "max-h-[360px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandEmpty"], {
                        children: "Nenhum resultado encontrado."
                    }, void 0, false, {
                        fileName: "[project]/components/CommandMenu.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                        heading: "Acesso rápido",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                onSelect: ()=>runCommand(()=>router.push("/")),
                                className: "flex items-center gap-2 cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__["Compass"], {
                                        className: "h-4 w-4 text-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 90,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Dashboard"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandShortcut"], {
                                        className: "text-xs",
                                        children: "Home"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 92,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CommandMenu.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                onSelect: ()=>runCommand(()=>router.push("/learn")),
                                className: "flex items-center gap-2 cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                        className: "h-4 w-4 text-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 98,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Aprender"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CommandMenu.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                onSelect: ()=>runCommand(()=>router.push("/practice")),
                                className: "flex items-center gap-2 cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                        className: "h-4 w-4 text-amber-400"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Praticar"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 106,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CommandMenu.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                onSelect: ()=>runCommand(()=>router.push("/community")),
                                className: "flex items-center gap-2 cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        className: "h-4 w-4 text-sky-400"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 112,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Comunidade"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 113,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CommandMenu.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                onSelect: ()=>runCommand(()=>router.push("/progress")),
                                className: "flex items-center gap-2 cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                        className: "h-4 w-4 text-emerald-400"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Meu progresso"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CommandMenu.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CommandMenu.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandSeparator"], {}, void 0, false, {
                        fileName: "[project]/components/CommandMenu.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                        heading: "Aprender",
                        children: LEARN.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                value: `aprender ${cat.name} ${cat.description}`,
                                onSelect: ()=>runCommand(()=>router.push(`/category/${cat.slug}`)),
                                className: "flex items-center gap-2 cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                        className: "h-4 w-4 text-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 136,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: cat.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 137,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                        className: "h-3 w-3 ml-auto opacity-40"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, cat.slug, true, {
                                fileName: "[project]/components/CommandMenu.tsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/CommandMenu.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandSeparator"], {}, void 0, false, {
                        fileName: "[project]/components/CommandMenu.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                        heading: "Praticar · Avaliação",
                        children: QUIZ.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                value: `praticar quiz avaliação ${cat.name}`,
                                onSelect: ()=>runCommand(()=>router.push(`/category/${cat.slug}/quiz`)),
                                className: "flex items-center gap-2 cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                        className: "h-4 w-4 text-amber-400"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: cat.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 156,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, `quiz-${cat.slug}`, true, {
                                fileName: "[project]/components/CommandMenu.tsx",
                                lineNumber: 147,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/CommandMenu.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandSeparator"], {}, void 0, false, {
                        fileName: "[project]/components/CommandMenu.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                        heading: "Artigos",
                        children: ARTICLES.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                value: `${a.title} ${a.summary} ${a.categorySlug}`,
                                onSelect: ()=>runCommand(()=>router.push(`/category/${a.categorySlug}/${a.slug}`)),
                                className: "flex items-center gap-2 cursor-pointer py-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                        className: "h-4 w-4 text-muted-foreground shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 175,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate font-medium text-foreground",
                                                children: a.title
                                            }, void 0, false, {
                                                fileName: "[project]/components/CommandMenu.tsx",
                                                lineNumber: 177,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate text-xs text-muted-foreground",
                                                children: a.categorySlug
                                            }, void 0, false, {
                                                fileName: "[project]/components/CommandMenu.tsx",
                                                lineNumber: 180,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/CommandMenu.tsx",
                                        lineNumber: 176,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, `${a.categorySlug}/${a.slug}`, true, {
                                fileName: "[project]/components/CommandMenu.tsx",
                                lineNumber: 165,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/CommandMenu.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CommandMenu.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CommandMenu.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
_s(CommandMenu, "RSQAXhGWMImE19xBvzVo18AYI7Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c4 = CommandMenu;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "LEARN$CATEGORIES.filter");
__turbopack_context__.k.register(_c1, "LEARN");
__turbopack_context__.k.register(_c2, "QUIZ$CATEGORIES.filter");
__turbopack_context__.k.register(_c3, "QUIZ");
__turbopack_context__.k.register(_c4, "CommandMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/CourseOutline.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CourseOutline",
    ()=>CourseOutline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$paths$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/paths.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/units.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$visited$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-visited.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function sectionArticles(sectionId, articles) {
    return articles.filter((a)=>(a.section || "_") === sectionId).sort((a, b)=>a.order - b.order);
}
function CourseOutline({ category, articles, activeSlug, showQuiz, onNavigate }) {
    _s();
    const sections = (category.sections?.length ? [
        ...category.sections
    ] : [
        {
            id: "_",
            name: "Articles",
            order: 1
        }
    ]).sort((a, b)=>a.order - b.order);
    const activeSectionId = articles.find((a)=>a.slug === activeSlug)?.section || sections.find((s)=>sectionArticles(s.id, articles).length > 0)?.id;
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "CourseOutline.useState": ()=>{
            const init = {};
            for (const s of sections){
                init[s.id] = s.id === activeSectionId;
            }
            if (!activeSectionId && sections[0]) init[sections[0].id] = true;
            return init;
        }
    }["CourseOutline.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CourseOutline.useEffect": ()=>{
            if (!activeSectionId) return;
            setOpen({
                "CourseOutline.useEffect": (prev)=>({
                        ...prev,
                        [activeSectionId]: true
                    })
            }["CourseOutline.useEffect"]);
        }
    }["CourseOutline.useEffect"], [
        activeSectionId
    ]);
    const visited = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$visited$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVisited"])();
    const [openUnits, setOpenUnits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    function toggleUnit(key, current) {
        setOpenUnits((prev)=>({
                ...prev,
                [key]: !current
            }));
    }
    function toggle(id) {
        setOpen((prev)=>({
                ...prev,
                [id]: !prev[id]
            }));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Course outline",
        className: "text-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/learn",
                onClick: onNavigate,
                className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                        className: "w-3.5 h-3.5"
                    }, void 0, false, {
                        fileName: "[project]/components/CourseOutline.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    "Back to Main"
                ]
            }, void 0, true, {
                fileName: "[project]/components/CourseOutline.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: `/category/${category.slug}`,
                onClick: onNavigate,
                className: "block font-semibold text-foreground hover:text-primary mb-4 leading-snug",
                children: [
                    category.name,
                    " Course"
                ]
            }, void 0, true, {
                fileName: "[project]/components/CourseOutline.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1",
                children: [
                    sections.map((sec)=>{
                        const items = sectionArticles(sec.id, articles);
                        const isOpen = !!open[sec.id];
                        const hasActive = items.some((a)=>a.slug === activeSlug);
                        const empty = items.length === 0;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-b border-border/60 last:border-0 pb-1 mb-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>toggle(sec.id),
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full items-center gap-2 py-2 text-left font-medium transition-colors", hasActive || isOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground"),
                                    "aria-expanded": isOpen,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-3.5 h-3.5 shrink-0 transition-transform", isOpen ? "rotate-0" : "-rotate-90")
                                        }, void 0, false, {
                                            fileName: "[project]/components/CourseOutline.tsx",
                                            lineNumber: 109,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex-1",
                                            children: sec.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/CourseOutline.tsx",
                                            lineNumber: 115,
                                            columnNumber: 17
                                        }, this),
                                        !empty ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] font-mono text-muted-foreground/80",
                                            children: [
                                                items.filter((a)=>visited.has((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$paths$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["articleHref"])(a))).length,
                                                "/",
                                                items.length
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CourseOutline.tsx",
                                            lineNumber: 117,
                                            columnNumber: 19
                                        }, this) : null,
                                        empty ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] uppercase tracking-wide text-muted-foreground/70",
                                            children: "Soon"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CourseOutline.tsx",
                                            lineNumber: 122,
                                            columnNumber: 19
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CourseOutline.tsx",
                                    lineNumber: 98,
                                    columnNumber: 15
                                }, this),
                                isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "ml-2 pl-3 border-l border-border space-y-0.5 pb-2",
                                    children: empty ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "text-xs text-muted-foreground py-1.5 pl-2",
                                        children: "Em breve"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CourseOutline.tsx",
                                        lineNumber: 131,
                                        columnNumber: 21
                                    }, this) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["groupByUnit"])(items).map((unit, ui)=>{
                                        const key = `${sec.id}:${ui}`;
                                        const hasActiveUnit = unit.items.some((a)=>a.slug === activeSlug);
                                        const unitOpen = !unit.name || (openUnits[key] ?? hasActiveUnit);
                                        const read = unit.items.filter((a)=>visited.has((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$paths$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["articleHref"])(a))).length;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                unit.name ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>toggleUnit(key, unitOpen),
                                                    "aria-expanded": unitOpen,
                                                    className: "mt-3 mb-1 flex w-full items-center gap-1.5 pl-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 hover:text-foreground",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-3 h-3 shrink-0 transition-transform", unitOpen ? "rotate-0" : "-rotate-90")
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CourseOutline.tsx",
                                                            lineNumber: 149,
                                                            columnNumber: 31
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex-1",
                                                            children: unit.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CourseOutline.tsx",
                                                            lineNumber: 155,
                                                            columnNumber: 31
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-mono normal-case tracking-normal",
                                                            children: [
                                                                read,
                                                                "/",
                                                                unit.items.length
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CourseOutline.tsx",
                                                            lineNumber: 156,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CourseOutline.tsx",
                                                    lineNumber: 143,
                                                    columnNumber: 29
                                                }, this) : null,
                                                unitOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "space-y-0.5",
                                                    children: unit.items.map((a)=>{
                                                        const active = a.slug === activeSlug;
                                                        const done = visited.has((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$paths$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["articleHref"])(a));
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$paths$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["articleHref"])(a),
                                                                onClick: onNavigate,
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 py-1.5 pl-2 -ml-px border-l-2 transition-colors leading-snug", active ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground hover:text-foreground"),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        "aria-label": done ? "Concluído" : "Não lido",
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-2 w-2 shrink-0 rounded-full", done ? "bg-green-500" : "border border-muted-foreground/60")
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/CourseOutline.tsx",
                                                                        lineNumber: 178,
                                                                        columnNumber: 39
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: a.navTitle || a.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/CourseOutline.tsx",
                                                                        lineNumber: 187,
                                                                        columnNumber: 39
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/CourseOutline.tsx",
                                                                lineNumber: 168,
                                                                columnNumber: 37
                                                            }, this)
                                                        }, a.slug, false, {
                                                            fileName: "[project]/components/CourseOutline.tsx",
                                                            lineNumber: 167,
                                                            columnNumber: 35
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CourseOutline.tsx",
                                                    lineNumber: 162,
                                                    columnNumber: 29
                                                }, this) : null
                                            ]
                                        }, key, true, {
                                            fileName: "[project]/components/CourseOutline.tsx",
                                            lineNumber: 141,
                                            columnNumber: 25
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/components/CourseOutline.tsx",
                                    lineNumber: 129,
                                    columnNumber: 17
                                }, this) : null
                            ]
                        }, sec.id, true, {
                            fileName: "[project]/components/CourseOutline.tsx",
                            lineNumber: 97,
                            columnNumber: 13
                        }, this);
                    }),
                    showQuiz || category.hasQuiz ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/category/${category.slug}/quiz`,
                        onClick: onNavigate,
                        className: "flex items-center gap-2 py-2.5 text-muted-foreground hover:text-foreground font-medium",
                        children: "Avaliação"
                    }, void 0, false, {
                        fileName: "[project]/components/CourseOutline.tsx",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/CourseOutline.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CourseOutline.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
_s(CourseOutline, "qtYc8a8tzKEk1TibOa5m9a4ailw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$visited$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVisited"]
    ];
});
_c = CourseOutline;
var _c;
__turbopack_context__.k.register(_c, "CourseOutline");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/CourseSidebarNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CourseSidebarNav",
    ()=>CourseSidebarNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MainNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MainNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CourseOutline$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CourseOutline.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$categories$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/content/categories.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$articles$2f$index$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/content/articles/index.json.[json].cjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const CATEGORIES = __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$categories$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
const ARTICLES = __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$articles$2f$index$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
function parseCategoryRoute(pathname) {
    const m = pathname.match(/^\/category\/([^/]+)(?:\/([^/]+))?/);
    if (!m) return null;
    const categorySlug = m[1];
    const rest = m[2];
    if (rest === "quiz") return {
        categorySlug
    };
    return {
        categorySlug,
        articleSlug: rest
    };
}
function CourseSidebarNav({ onNavigate, className }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])() || "";
    const route = parseCategoryRoute(pathname);
    if (!route) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MainNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MainNav"], {
            onNavigate: onNavigate,
            className: className
        }, void 0, false, {
            fileName: "[project]/components/CourseSidebarNav.tsx",
            lineNumber: 37,
            columnNumber: 12
        }, this);
    }
    const category = CATEGORIES.find((c)=>c.slug === route.categorySlug);
    if (!category || category.stub) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MainNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MainNav"], {
            onNavigate: onNavigate,
            className: className
        }, void 0, false, {
            fileName: "[project]/components/CourseSidebarNav.tsx",
            lineNumber: 42,
            columnNumber: 12
        }, this);
    }
    const articles = ARTICLES.filter((a)=>a.categorySlug === route.categorySlug);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col h-full overflow-y-auto px-4 py-5 ${className || ""}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CourseOutline$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CourseOutline"], {
            category: category,
            articles: articles,
            activeSlug: route.articleSlug,
            showQuiz: !!category.hasQuiz,
            onNavigate: onNavigate
        }, void 0, false, {
            fileName: "[project]/components/CourseSidebarNav.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/CourseSidebarNav.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(CourseSidebarNav, "wVXOWZKWdId76kQQO0KX6Oz3JDA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = CourseSidebarNav;
var _c;
__turbopack_context__.k.register(_c, "CourseSidebarNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/MainNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MainNav",
    ()=>MainNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.mjs [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.mjs [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.mjs [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.mjs [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/terminal.mjs [app-client] (ecmascript) <export default as Terminal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/nav.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const SECTION_ICON = {
    learn: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
    practice: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
    community: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"]
};
function MainNav({ onNavigate, className }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const sections = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNavSections"])();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        learn: true,
        practice: false,
        community: false
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col h-full", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/",
                onClick: onNavigate,
                className: "flex items-center gap-3 h-14 px-5 border-b border-border shrink-0 hover:bg-secondary/40 transition-colors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/components/MainNav.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/MainNav.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-semibold tracking-tight text-foreground",
                        children: "codetoscale"
                    }, void 0, false, {
                        fileName: "[project]/components/MainNav.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MainNav.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1 overflow-y-auto px-3 py-4 space-y-0.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        onClick: onNavigate,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors", pathname === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/components/MainNav.tsx",
                                lineNumber: 64,
                                columnNumber: 11
                            }, this),
                            "Dashboard"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MainNav.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    sections.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavSectionBlock, {
                            section: section,
                            expanded: !!expanded[section.id],
                            onToggle: ()=>setExpanded((prev)=>({
                                        ...prev,
                                        [section.id]: !prev[section.id]
                                    })),
                            pathname: pathname,
                            onNavigate: onNavigate
                        }, section.id, false, {
                            fileName: "[project]/components/MainNav.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/MainNav.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MainNav.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_s(MainNav, "G3kcIGehkXxtSdxZHTSMPV48fMA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = MainNav;
function NavSectionBlock({ section, expanded, onToggle, pathname, onNavigate }) {
    const Icon = SECTION_ICON[section.id];
    const sectionActive = pathname === section.href || section.links.some((l)=>pathname === l.href || pathname.startsWith(`${l.href}/`));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pt-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onToggle,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors", sectionActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"),
                "aria-expanded": expanded,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        className: "w-4 h-4 shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/components/MainNav.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex-1 text-left",
                        children: section.label
                    }, void 0, false, {
                        fileName: "[project]/components/MainNav.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-4 h-4 transition-transform", expanded ? "rotate-0" : "-rotate-90")
                    }, void 0, false, {
                        fileName: "[project]/components/MainNav.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MainNav.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            expanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ml-3 pl-3 border-l border-border space-y-0.5 mt-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: section.href,
                        onClick: onNavigate,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("block rounded-md px-3 py-2 text-sm transition-colors", pathname === section.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"),
                        children: "Visão geral"
                    }, void 0, false, {
                        fileName: "[project]/components/MainNav.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this),
                    section.links.map((link)=>{
                        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                link.dividerBefore ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "my-2 border-t border-border"
                                }, void 0, false, {
                                    fileName: "[project]/components/MainNav.tsx",
                                    lineNumber: 150,
                                    columnNumber: 19
                                }, this) : null,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: link.href,
                                    onClick: onNavigate,
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors", active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex-1 line-clamp-1",
                                            children: link.label
                                        }, void 0, false, {
                                            fileName: "[project]/components/MainNav.tsx",
                                            lineNumber: 162,
                                            columnNumber: 19
                                        }, this),
                                        link.badge ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "shrink-0 text-[10px] font-medium uppercase tracking-wide text-primary bg-primary/10 px-1.5 py-0.5 rounded",
                                            children: link.badge
                                        }, void 0, false, {
                                            fileName: "[project]/components/MainNav.tsx",
                                            lineNumber: 164,
                                            columnNumber: 21
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MainNav.tsx",
                                    lineNumber: 152,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, link.href + link.label, true, {
                            fileName: "[project]/components/MainNav.tsx",
                            lineNumber: 148,
                            columnNumber: 15
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/components/MainNav.tsx",
                lineNumber: 131,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/MainNav.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_c1 = NavSectionBlock;
var _c, _c1;
__turbopack_context__.k.register(_c, "MainNav");
__turbopack_context__.k.register(_c1, "NavSectionBlock");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/NavDrawer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavDrawer",
    ()=>NavDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/sheet.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CourseSidebarNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CourseSidebarNav.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function NavDrawer({ open, onOpenChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sheet"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetContent"], {
            side: "left",
            className: "w-[300px] p-0 flex flex-col lg:hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetHeader"], {
                    className: "sr-only",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTitle"], {
                        children: "Navegação"
                    }, void 0, false, {
                        fileName: "[project]/components/NavDrawer.tsx",
                        lineNumber: 23,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/NavDrawer.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CourseSidebarNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CourseSidebarNav"], {
                    onNavigate: ()=>onOpenChange(false)
                }, void 0, false, {
                    fileName: "[project]/components/NavDrawer.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/NavDrawer.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/NavDrawer.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c = NavDrawer;
var _c;
__turbopack_context__.k.register(_c, "NavDrawer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ProgressProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProgressProvider",
    ()=>ProgressProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dev$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dev.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$progress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/progress.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ProgressProvider({ children }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProgressProvider.useEffect": ()=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dev$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDevBypass"])()) (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$progress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hydrateLocalDev"])();
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
            let alive = true;
            async function load(uid) {
                const { data, error } = await supabase.from("user_progress").select("user_id, visited, last_path, gates, quiz, sessions, simulador").eq("user_id", uid).maybeSingle();
                if (!alive) return;
                if (error) console.error("Falha ao ler progresso", error.message);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$progress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hydrateProgressFromServer"])(uid, data);
            }
            supabase.auth.getUser().then({
                "ProgressProvider.useEffect": ({ data: { user } })=>{
                    if (user) void load(user.id);
                }
            }["ProgressProvider.useEffect"]);
            const { data: { subscription } } = supabase.auth.onAuthStateChange({
                "ProgressProvider.useEffect": (event, session)=>{
                    if (event === "SIGNED_OUT") {
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dev$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDevBypass"])()) (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$progress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hydrateLocalDev"])();
                        else (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$progress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearProgressCache"])();
                        return;
                    }
                    if (session?.user) void load(session.user.id);
                }
            }["ProgressProvider.useEffect"]);
            const onHide = {
                "ProgressProvider.useEffect.onHide": ()=>{
                    void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$progress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushProgress"])();
                }
            }["ProgressProvider.useEffect.onHide"];
            window.addEventListener("pagehide", onHide);
            document.addEventListener("visibilitychange", {
                "ProgressProvider.useEffect": ()=>{
                    if (document.visibilityState === "hidden") onHide();
                }
            }["ProgressProvider.useEffect"]);
            return ({
                "ProgressProvider.useEffect": ()=>{
                    alive = false;
                    subscription.unsubscribe();
                    window.removeEventListener("pagehide", onHide);
                    void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$progress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushProgress"])();
                }
            })["ProgressProvider.useEffect"];
        }
    }["ProgressProvider.useEffect"], []);
    return children;
}
_s(ProgressProvider, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ProgressProvider;
var _c;
__turbopack_context__.k.register(_c, "ProgressProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ScrollToTop.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollToTop",
    ()=>ScrollToTop
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function getHashId(hash) {
    const rawId = hash.slice(1);
    try {
        return decodeURIComponent(rawId);
    } catch  {
        return rawId;
    }
}
function ScrollToTop() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const isPop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScrollToTop.useEffect": ()=>{
            const onPopState = {
                "ScrollToTop.useEffect.onPopState": ()=>{
                    isPop.current = true;
                }
            }["ScrollToTop.useEffect.onPopState"];
            window.addEventListener("popstate", onPopState);
            return ({
                "ScrollToTop.useEffect": ()=>window.removeEventListener("popstate", onPopState)
            })["ScrollToTop.useEffect"];
        }
    }["ScrollToTop.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScrollToTop.useEffect": ()=>{
            if (isPop.current) {
                isPop.current = false;
                return;
            }
            const hash = window.location.hash;
            if (hash) {
                const id = getHashId(hash);
                const timer = window.setTimeout({
                    "ScrollToTop.useEffect.timer": ()=>{
                        document.getElementById(id)?.scrollIntoView({
                            behavior: "smooth"
                        });
                    }
                }["ScrollToTop.useEffect.timer"], 50);
                return ({
                    "ScrollToTop.useEffect": ()=>window.clearTimeout(timer)
                })["ScrollToTop.useEffect"];
            }
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "auto"
            });
        }
    }["ScrollToTop.useEffect"], [
        pathname
    ]);
    return null;
}
_s(ScrollToTop, "vjAPObCiVdO6zg5YV1EqP/EA0qU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = ScrollToTop;
var _c;
__turbopack_context__.k.register(_c, "ScrollToTop");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/SiteHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SiteHeader",
    ()=>SiteHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.mjs [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$sidebar$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/sidebar-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$NavDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/NavDrawer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$progress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/progress.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/popover.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/separator.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
function SiteHeader() {
    _s();
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { open, setOpen, toggle, toggleCommand } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$sidebar$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSidebar"])();
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SiteHeader.useEffect": ()=>setReady(true)
    }["SiteHeader.useEffect"], []);
    const isLogin = path === "/login" || path === "/acesso-restrito";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SiteHeader.useEffect": ()=>{
            if (!("TURBOPACK compile-time value", "https://xxxuqxmruoolmtqozcjf.supabase.co") || isLogin) return;
            const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
            function fromSession(u) {
                if (!u) {
                    setUser(null);
                    return;
                }
                const meta = u.user_metadata ?? {};
                const name = typeof meta.full_name === "string" && meta.full_name || typeof meta.name === "string" && meta.name || u.email || "Conta";
                const avatar = typeof meta.avatar_url === "string" ? meta.avatar_url : typeof meta.picture === "string" ? meta.picture : undefined;
                setUser({
                    name,
                    avatar
                });
            }
            supabase.auth.getUser().then({
                "SiteHeader.useEffect": ({ data })=>fromSession(data.user)
            }["SiteHeader.useEffect"]);
            const { data: { subscription } } = supabase.auth.onAuthStateChange({
                "SiteHeader.useEffect": (_event, session)=>{
                    fromSession(session?.user ?? null);
                }
            }["SiteHeader.useEffect"]);
            return ({
                "SiteHeader.useEffect": ()=>subscription.unsubscribe()
            })["SiteHeader.useEffect"];
        }
    }["SiteHeader.useEffect"], [
        isLogin
    ]);
    async function signOut() {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$progress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushProgress"])();
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
        await supabase.auth.signOut();
        window.location.href = "/login";
    }
    if (!ready) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-30 h-14 border-b border-border bg-background/80 backdrop-blur",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between h-14 px-4 sm:px-6 gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: toggle,
                                    className: "lg:hidden flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
                                    "aria-label": "Abrir menu",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SiteHeader.tsx",
                                        lineNumber: 87,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/SiteHeader.tsx",
                                    lineNumber: 81,
                                    columnNumber: 13
                                }, this),
                                toggleCommand ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: toggleCommand,
                                    className: "flex items-center gap-2 h-9 px-3 rounded-full bg-secondary/60 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground border border-border/80 transition-colors w-full max-w-md",
                                    "aria-label": "Buscar",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            className: "h-4 w-4 shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteHeader.tsx",
                                            lineNumber: 97,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: "Buscar..."
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteHeader.tsx",
                                            lineNumber: 98,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                            className: "ml-auto hidden sm:inline-flex font-mono text-[10px] bg-background/80 px-1.5 py-0.5 rounded border border-border",
                                            children: "⌘K"
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteHeader.tsx",
                                            lineNumber: 99,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/SiteHeader.tsx",
                                    lineNumber: 91,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/SiteHeader.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "header-actions flex items-center gap-2 shrink-0",
                            children: user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "sm",
                                            className: "h-8 gap-2 px-2 text-muted-foreground",
                                            children: [
                                                user.avatar ? // eslint-disable-next-line @next/next/no-img-element
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: user.avatar,
                                                    alt: "",
                                                    className: "w-6 h-6 rounded-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/SiteHeader.tsx",
                                                    lineNumber: 117,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/SiteHeader.tsx",
                                                    lineNumber: 123,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "hidden sm:inline max-w-[8rem] truncate text-xs",
                                                    children: user.name
                                                }, void 0, false, {
                                                    fileName: "[project]/components/SiteHeader.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/SiteHeader.tsx",
                                            lineNumber: 110,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/SiteHeader.tsx",
                                        lineNumber: 109,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                                        align: "end",
                                        className: "w-56",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium truncate",
                                                children: user.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/SiteHeader.tsx",
                                                lineNumber: 131,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                                className: "my-2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SiteHeader.tsx",
                                                lineNumber: 132,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                className: "w-full justify-start gap-2",
                                                onClick: ()=>void signOut(),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/SiteHeader.tsx",
                                                        lineNumber: 138,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Sair"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/SiteHeader.tsx",
                                                lineNumber: 133,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SiteHeader.tsx",
                                        lineNumber: 130,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SiteHeader.tsx",
                                lineNumber: 108,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                asChild: true,
                                variant: "outline",
                                size: "sm",
                                className: "h-8 text-xs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/login",
                                    children: "Entrar"
                                }, void 0, false, {
                                    fileName: "[project]/components/SiteHeader.tsx",
                                    lineNumber: 145,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/SiteHeader.tsx",
                                lineNumber: 144,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/SiteHeader.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SiteHeader.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/SiteHeader.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$NavDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavDrawer"], {
                open: open,
                onOpenChange: setOpen
            }, void 0, false, {
                fileName: "[project]/components/SiteHeader.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/SiteHeader.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
_s(SiteHeader, "ZQtsrPOmMDxvnZvHAK2fJpWODzY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$sidebar$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSidebar"]
    ];
});
_c = SiteHeader;
var _c;
__turbopack_context__.k.register(_c, "SiteHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/sidebar-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SidebarContext",
    ()=>SidebarContext,
    "useSidebar",
    ()=>useSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const SidebarContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function useSidebar() {
    _s();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SidebarContext);
    if (!ctx) throw new Error("useSidebar precisa estar dentro de AppShell");
    return ctx;
}
_s(useSidebar, "/dMy7t63NXD4eYACoT93CePwGrg=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
            outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-8",
            icon: "h-9 w-9"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 47,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/command.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Command",
    ()=>Command,
    "CommandDialog",
    ()=>CommandDialog,
    "CommandEmpty",
    ()=>CommandEmpty,
    "CommandGroup",
    ()=>CommandGroup,
    "CommandInput",
    ()=>CommandInput,
    "CommandItem",
    ()=>CommandItem,
    "CommandList",
    ()=>CommandList,
    "CommandSeparator",
    ()=>CommandSeparator,
    "CommandShortcut",
    ()=>CommandShortcut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cmdk/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
const Command = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 15,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c = Command;
Command.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].displayName;
const CommandDialog = ({ children, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "overflow-hidden p-0",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Command, {
                className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/command.tsx",
                lineNumber: 32,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/ui/command.tsx",
            lineNumber: 31,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = CommandDialog;
const CommandInput = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center border-b px-3",
        "cmdk-input-wrapper": "",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                className: "mr-2 h-4 w-4 shrink-0 opacity-50"
            }, void 0, false, {
                fileName: "[project]/components/ui/command.tsx",
                lineNumber: 47,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Input, {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
                ...props
            }, void 0, false, {
                fileName: "[project]/components/ui/command.tsx",
                lineNumber: 48,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 46,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CommandInput;
CommandInput.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Input.displayName;
const CommandList = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].List, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 64,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CommandList;
CommandList.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].List.displayName;
const CommandEmpty = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = (props, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Empty, {
        ref: ref,
        className: "py-6 text-center text-sm",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 76,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CommandEmpty;
CommandEmpty.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Empty.displayName;
const CommandGroup = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Group, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 88,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CommandGroup;
CommandGroup.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Group.displayName;
const CommandSeparator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Separator, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-1 h-px bg-border", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 103,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CommandSeparator;
CommandSeparator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Separator.displayName;
const CommandItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c12 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Item, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 115,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c13 = CommandItem;
CommandItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Item.displayName;
const CommandShortcut = ({ className, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("ml-auto text-xs tracking-widest text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 131,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c14 = CommandShortcut;
CommandShortcut.displayName = "CommandShortcut";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14;
__turbopack_context__.k.register(_c, "Command");
__turbopack_context__.k.register(_c1, "CommandDialog");
__turbopack_context__.k.register(_c2, "CommandInput$React.forwardRef");
__turbopack_context__.k.register(_c3, "CommandInput");
__turbopack_context__.k.register(_c4, "CommandList$React.forwardRef");
__turbopack_context__.k.register(_c5, "CommandList");
__turbopack_context__.k.register(_c6, "CommandEmpty$React.forwardRef");
__turbopack_context__.k.register(_c7, "CommandEmpty");
__turbopack_context__.k.register(_c8, "CommandGroup$React.forwardRef");
__turbopack_context__.k.register(_c9, "CommandGroup");
__turbopack_context__.k.register(_c10, "CommandSeparator$React.forwardRef");
__turbopack_context__.k.register(_c11, "CommandSeparator");
__turbopack_context__.k.register(_c12, "CommandItem$React.forwardRef");
__turbopack_context__.k.register(_c13, "CommandItem");
__turbopack_context__.k.register(_c14, "CommandShortcut");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const Dialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const DialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const DialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const DialogClose = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"];
const DialogOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 21,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c = DialogOverlay;
DialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const DialogContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/components/ui/dialog.tsx",
                lineNumber: 37,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className),
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/dialog.tsx",
                                lineNumber: 48,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/dialog.tsx",
                                lineNumber: 49,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/dialog.tsx",
                        lineNumber: 47,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/dialog.tsx",
                lineNumber: 38,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 36,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c2 = DialogContent;
DialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const DialogHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 60,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c3 = DialogHeader;
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 74,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c4 = DialogFooter;
DialogFooter.displayName = "DialogFooter";
const DialogTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c5 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 88,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c6 = DialogTitle;
DialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const DialogDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c7 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 103,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c8 = DialogDescription;
DialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "DialogOverlay");
__turbopack_context__.k.register(_c1, "DialogContent$React.forwardRef");
__turbopack_context__.k.register(_c2, "DialogContent");
__turbopack_context__.k.register(_c3, "DialogHeader");
__turbopack_context__.k.register(_c4, "DialogFooter");
__turbopack_context__.k.register(_c5, "DialogTitle$React.forwardRef");
__turbopack_context__.k.register(_c6, "DialogTitle");
__turbopack_context__.k.register(_c7, "DialogDescription$React.forwardRef");
__turbopack_context__.k.register(_c8, "DialogDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/popover.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Popover",
    ()=>Popover,
    "PopoverAnchor",
    ()=>PopoverAnchor,
    "PopoverContent",
    ()=>PopoverContent,
    "PopoverTrigger",
    ()=>PopoverTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-popover/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const Popover = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const PopoverTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const PopoverAnchor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Anchor"];
const PopoverContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, align = "center", sideOffset = 4, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            align: align,
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/popover.tsx",
            lineNumber: 19,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/popover.tsx",
        lineNumber: 18,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = PopoverContent;
PopoverContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "PopoverContent$React.forwardRef");
__turbopack_context__.k.register(_c1, "PopoverContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/separator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Separator",
    ()=>Separator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-separator/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const Separator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, orientation = "horizontal", decorative = true, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        decorative: decorative,
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/separator.tsx",
        lineNumber: 13,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Separator;
Separator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Separator$React.forwardRef");
__turbopack_context__.k.register(_c1, "Separator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/sheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sheet",
    ()=>Sheet,
    "SheetClose",
    ()=>SheetClose,
    "SheetContent",
    ()=>SheetContent,
    "SheetDescription",
    ()=>SheetDescription,
    "SheetFooter",
    ()=>SheetFooter,
    "SheetHeader",
    ()=>SheetHeader,
    "SheetOverlay",
    ()=>SheetOverlay,
    "SheetPortal",
    ()=>SheetPortal,
    "SheetTitle",
    ()=>SheetTitle,
    "SheetTrigger",
    ()=>SheetTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
const Sheet = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const SheetTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const SheetClose = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"];
const SheetPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const SheetOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 22,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c = SheetOverlay;
SheetOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const sheetVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
    variants: {
        side: {
            top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
            bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
            right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
        }
    },
    defaultVariants: {
        side: "right"
    }
});
const SheetContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = ({ side = "right", className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SheetPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SheetOverlay, {}, void 0, false, {
                fileName: "[project]/components/ui/sheet.tsx",
                lineNumber: 61,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(sheetVariants({
                    side
                }), className),
                ...props,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/sheet.tsx",
                                lineNumber: 68,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/sheet.tsx",
                                lineNumber: 69,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/sheet.tsx",
                        lineNumber: 67,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/sheet.tsx",
                lineNumber: 62,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 60,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c2 = SheetContent;
SheetContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const SheetHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-2 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 81,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c3 = SheetHeader;
SheetHeader.displayName = "SheetHeader";
const SheetFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c4 = SheetFooter;
SheetFooter.displayName = "SheetFooter";
const SheetTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c5 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold text-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 109,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c6 = SheetTitle;
SheetTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const SheetDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c7 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 121,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c8 = SheetDescription;
SheetDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "SheetOverlay");
__turbopack_context__.k.register(_c1, "SheetContent$React.forwardRef");
__turbopack_context__.k.register(_c2, "SheetContent");
__turbopack_context__.k.register(_c3, "SheetHeader");
__turbopack_context__.k.register(_c4, "SheetFooter");
__turbopack_context__.k.register(_c5, "SheetTitle$React.forwardRef");
__turbopack_context__.k.register(_c6, "SheetTitle");
__turbopack_context__.k.register(_c7, "SheetDescription$React.forwardRef");
__turbopack_context__.k.register(_c8, "SheetDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/content/articles/index.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = JSON.parse("[{\"slug\":\"como-funciona-entrevista-ai-coding\",\"categorySlug\":\"ai-coding\",\"title\":\"Como Funciona uma Entrevista de AI Coding e o que é Avaliado\",\"summary\":\"Entender o formato típico desse tipo de entrevista\",\"level\":\"intermediario\",\"order\":1,\"section\":\"fundamentals\",\"file\":\"ai-coding/como-funciona-entrevista-ai-coding.md\"},{\"slug\":\"prompting-eficaz\",\"categorySlug\":\"ai-coding\",\"title\":\"Prompting Eficaz Durante a Entrevista\",\"summary\":\"Estruturar um prompt inicial claro e específico\",\"level\":\"intermediario\",\"order\":2,\"section\":\"fundamentals\",\"file\":\"ai-coding/prompting-eficaz.md\"},{\"slug\":\"revisao-critica-codigo-gerado\",\"categorySlug\":\"ai-coding\",\"title\":\"Revisão Crítica do Código Gerado pela IA\",\"summary\":\"Desenvolver um checklist mental para revisar código gerado antes de aceitá-lo\",\"level\":\"intermediario\",\"order\":3,\"section\":\"fundamentals\",\"file\":\"ai-coding/revisao-critica-codigo-gerado.md\"},{\"slug\":\"definir-tarefa-antes-de-acionar-ia\",\"categorySlug\":\"ai-coding\",\"title\":\"Definir a Tarefa Antes de Acionar a IA\",\"summary\":\"Resistir ao impulso de acionar a IA imediatamente, sem antes entender a tarefa\",\"level\":\"intermediario\",\"order\":4,\"section\":\"workflow\",\"file\":\"ai-coding/definir-tarefa-antes-de-acionar-ia.md\"},{\"slug\":\"iterando-com-a-ia\",\"categorySlug\":\"ai-coding\",\"title\":\"Iterando com a IA: Prompts de Refinamento\",\"navTitle\":\"Iterando com a IA\",\"summary\":\"Estruturar iterações eficazes quando o primeiro resultado não é satisfatório\",\"level\":\"intermediario\",\"order\":5,\"section\":\"workflow\",\"file\":\"ai-coding/iterando-com-a-ia.md\"},{\"slug\":\"validar-testar-resultado\",\"categorySlug\":\"ai-coding\",\"title\":\"Validar e Testar o Resultado\",\"summary\":\"Estruturar uma etapa final de validação antes de considerar a tarefa concluída\",\"level\":\"intermediario\",\"order\":6,\"section\":\"workflow\",\"file\":\"ai-coding/validar-testar-resultado.md\"},{\"slug\":\"aceitar-codigo-sem-entender\",\"categorySlug\":\"ai-coding\",\"title\":\"Aceitar Código sem Entender de Verdade\",\"summary\":\"Reconhecer o risco de aceitar código que você não conseguiria explicar\",\"level\":\"intermediario\",\"order\":7,\"section\":\"pitfalls\",\"file\":\"ai-coding/aceitar-codigo-sem-entender.md\"},{\"slug\":\"nao-verbalizar-decisoes\",\"categorySlug\":\"ai-coding\",\"title\":\"Não Verbalizar Decisões Durante o Processo\",\"summary\":\"Reconhecer a importância de narrar decisões mesmo ao trabalhar com IA\",\"level\":\"intermediario\",\"order\":8,\"section\":\"pitfalls\",\"file\":\"ai-coding/nao-verbalizar-decisoes.md\"},{\"slug\":\"exercicio-guiado\",\"categorySlug\":\"ai-coding\",\"title\":\"Exercício Guiado: Implementar uma Feature com Apoio de IA\",\"navTitle\":\"Implementar uma Feature com Apoio de IA\",\"summary\":\"Escolha uma base de código pequena que você já conheça (um projeto pessoal, ou um repositório de código aberto simples) e, com apoio de uma IA, implemente uma nova funcionalidade pequena mas real — por exemplo, adicionar\",\"level\":\"avancado\",\"order\":9,\"section\":\"practice\",\"file\":\"ai-coding/exercicio-guiado.md\"},{\"slug\":\"por-que-behavioral-importa\",\"categorySlug\":\"behavioral\",\"title\":\"Por que a Entrevista Comportamental Importa\",\"summary\":\"Entender o papel da entrevista comportamental no processo de contratação\",\"level\":\"intermediario\",\"order\":1,\"section\":\"fundamentals\",\"file\":\"behavioral/por-que-behavioral-importa.md\"},{\"slug\":\"ciclo-decodificar-selecionar-contar\",\"categorySlug\":\"behavioral\",\"title\":\"O Ciclo: Decodificar, Selecionar, Contar\",\"navTitle\":\"O Ciclo\",\"summary\":\"Internalizar as três etapas mentais que se repetem a cada pergunta comportamental\",\"level\":\"intermediario\",\"order\":2,\"section\":\"fundamentals\",\"file\":\"behavioral/ciclo-decodificar-selecionar-contar.md\"},{\"slug\":\"interpretando-a-pergunta-real\",\"categorySlug\":\"behavioral\",\"title\":\"Interpretando o que o Entrevistador Realmente Pergunta\",\"summary\":\"Reconhecer as competências mais comuns por trás de perguntas frequentes\",\"level\":\"intermediario\",\"order\":3,\"section\":\"fundamentals\",\"file\":\"behavioral/interpretando-a-pergunta-real.md\"},{\"slug\":\"identificando-historias-fortes\",\"categorySlug\":\"behavioral\",\"title\":\"Identificando suas Histórias Mais Fortes\",\"summary\":\"Levantar um conjunto inicial de experiências candidatas a histórias\",\"level\":\"intermediario\",\"order\":4,\"section\":\"story-catalog\",\"file\":\"behavioral/identificando-historias-fortes.md\"},{\"slug\":\"estrutura-situacao-acao-resultado-aprendizado\",\"categorySlug\":\"behavioral\",\"title\":\"Estrutura de Resposta: Situação, Ação, Resultado, Aprendizado\",\"navTitle\":\"Estrutura de Resposta\",\"summary\":\"Aplicar uma estrutura clara e repetível para contar qualquer história\",\"level\":\"intermediario\",\"order\":5,\"section\":\"story-catalog\",\"file\":\"behavioral/estrutura-situacao-acao-resultado-aprendizado.md\"},{\"slug\":\"adaptando-historia-perguntas-diferentes\",\"categorySlug\":\"behavioral\",\"title\":\"Adaptando a Mesma História a Perguntas Diferentes\",\"summary\":\"Reutilizar uma mesma experiência para responder categorias diferentes de pergunta\",\"level\":\"intermediario\",\"order\":6,\"section\":\"story-catalog\",\"file\":\"behavioral/adaptando-historia-perguntas-diferentes.md\"},{\"slug\":\"conflito-desacordo\",\"categorySlug\":\"behavioral\",\"title\":\"Conflito e Desacordo\",\"summary\":\"Entender o que realmente é avaliado em perguntas sobre conflito\",\"level\":\"intermediario\",\"order\":7,\"section\":\"question-categories\",\"file\":\"behavioral/conflito-desacordo.md\"},{\"slug\":\"lideranca-influencia\",\"categorySlug\":\"behavioral\",\"title\":\"Liderança e Influência sem Autoridade\",\"summary\":\"Reconhecer que liderança, nesse contexto, não exige um cargo formal\",\"level\":\"intermediario\",\"order\":8,\"section\":\"question-categories\",\"file\":\"behavioral/lideranca-influencia.md\"},{\"slug\":\"falha-aprendizado\",\"categorySlug\":\"behavioral\",\"title\":\"Falha e Aprendizado\",\"summary\":\"Escolher uma falha real e apropriada para compartilhar em entrevista\",\"level\":\"intermediario\",\"order\":9,\"section\":\"question-categories\",\"file\":\"behavioral/falha-aprendizado.md\"},{\"slug\":\"ambiguidade-priorizacao\",\"categorySlug\":\"behavioral\",\"title\":\"Ambiguidade e Priorização\",\"summary\":\"Reconhecer o que perguntas sobre ambiguidade e priorização avaliam\",\"level\":\"intermediario\",\"order\":10,\"section\":\"question-categories\",\"file\":\"behavioral/ambiguidade-priorizacao.md\"},{\"slug\":\"simulado-guiado\",\"categorySlug\":\"behavioral\",\"title\":\"Simulado Guiado com Checklist de Autoavaliação\",\"summary\":\"Escolha 4 perguntas abaixo (uma de cada categoria do Módulo 3) e responda em voz alta, cronometrando cada resposta entre 2 e 3 minutos — o tempo típico esperado em uma entrevista real. Depois de cada resposta, revise usa\",\"level\":\"avancado\",\"order\":11,\"section\":\"practice\",\"file\":\"behavioral/simulado-guiado.md\"},{\"slug\":\"as-tres-perguntas-mais-importantes\",\"categorySlug\":\"behavioral\",\"title\":\"As Três Perguntas Mais Importantes\",\"navTitle\":\"As Três Perguntas Mais Importantes\",\"summary\":\"Preparar com prioridade máxima as três perguntas que aparecem em quase todo processo seletivo\",\"level\":\"intermediario\",\"order\":12,\"section\":\"advanced-topics\",\"file\":\"behavioral/as-tres-perguntas-mais-importantes.md\"},{\"slug\":\"adaptando-para-big-tech\",\"categorySlug\":\"behavioral\",\"title\":\"Adaptando-se para Entrevistas em Big Techs\",\"navTitle\":\"Adaptando-se para Big Tech\",\"summary\":\"Reformular experiências de empresas menores para o padrão de avaliação das grandes empresas de tecnologia\",\"level\":\"intermediario\",\"order\":13,\"section\":\"advanced-topics\",\"file\":\"behavioral/adaptando-para-big-tech.md\"},{\"slug\":\"armadilhas-comuns\",\"categorySlug\":\"behavioral\",\"title\":\"Armadilhas Comuns\",\"navTitle\":\"Armadilhas Comuns\",\"summary\":\"Reconhecer os erros mais frequentes em respostas comportamentais, mesmo entre candidatos tecnicamente fortes\",\"level\":\"intermediario\",\"order\":14,\"section\":\"advanced-topics\",\"file\":\"behavioral/armadilhas-comuns.md\"},{\"slug\":\"tipos-especiais-de-entrevista\",\"categorySlug\":\"behavioral\",\"title\":\"Tipos Especiais de Entrevista\",\"navTitle\":\"Tipos Especiais de Entrevista\",\"summary\":\"Adaptar o mesmo ciclo Decodificar-Selecionar-Contar a formatos diferentes de conversa comportamental\",\"level\":\"avancado\",\"order\":15,\"section\":\"advanced-topics\",\"file\":\"behavioral/tipos-especiais-de-entrevista.md\"},{\"slug\":\"respondendo-perguntas-sobre-ia\",\"categorySlug\":\"behavioral\",\"title\":\"Respondendo Perguntas sobre Uso de IA\",\"navTitle\":\"Perguntas sobre Uso de IA\",\"summary\":\"Reconhecer as áreas específicas que entrevistadores avaliam ao perguntar sobre uso de ferramentas de IA no trabalho\",\"level\":\"intermediario\",\"order\":16,\"section\":\"advanced-topics\",\"file\":\"behavioral/respondendo-perguntas-sobre-ia.md\"},{\"slug\":\"perguntas-frequentes-por-empresa\",\"categorySlug\":\"behavioral\",\"title\":\"Perguntas Mais Frequentes por Empresa\",\"navTitle\":\"Perguntas por Empresa\",\"summary\":\"Reconhecer o que cada Big Tech tende a enfatizar na entrevista comportamental, com base em valores publicados por cada empresa\",\"level\":\"avancado\",\"order\":17,\"section\":\"advanced-topics\",\"file\":\"behavioral/perguntas-frequentes-por-empresa.md\"},{\"slug\":\"o-que-e-avaliado\",\"categorySlug\":\"code\",\"title\":\"O que é Avaliado Além do Código Funcionar\",\"summary\":\"Entender os critérios de avaliação além de \\\"o código funciona\\\"\",\"level\":\"intermediario\",\"order\":1,\"section\":\"fundamentals\",\"file\":\"code/o-que-e-avaliado.md\"},{\"slug\":\"comunicando-raciocinio\",\"categorySlug\":\"code\",\"title\":\"Comunicando o Raciocínio Durante a Resolução\",\"summary\":\"Praticar a narração do raciocínio em tempo real\",\"level\":\"intermediario\",\"order\":2,\"section\":\"fundamentals\",\"file\":\"code/comunicando-raciocinio.md\"},{\"slug\":\"complexidade-tempo-espaco\",\"categorySlug\":\"code\",\"title\":\"Analisando Complexidade de Tempo e Espaço\",\"summary\":\"Analisar a complexidade de tempo e espaço de uma solução de forma prática\",\"level\":\"intermediario\",\"order\":3,\"section\":\"fundamentals\",\"file\":\"code/complexidade-tempo-espaco.md\"},{\"slug\":\"two-pointers\",\"categorySlug\":\"code\",\"title\":\"Dois Ponteiros: Introdução\",\"navTitle\":\"Introdução\",\"summary\":\"O que é a técnica de dois ponteiros, por que ela existe e as duas famílias principais de problemas que ela resolve.\",\"level\":\"intermediario\",\"order\":4,\"section\":\"two-pointers\",\"group\":\"Intro\",\"file\":\"code/two-pointers.md\"},{\"slug\":\"entendendo-invariantes\",\"categorySlug\":\"code\",\"title\":\"Entendendo Invariantes\",\"navTitle\":\"Entendendo Invariantes\",\"summary\":\"O que é o invariante que os ponteiros mantêm a cada passo, e por que ele garante que a resposta nunca é descartada por engano.\",\"level\":\"intermediario\",\"order\":5,\"section\":\"two-pointers\",\"group\":\"Conceitos Centrais\",\"file\":\"code/entendendo-invariantes.md\"},{\"slug\":\"formas-de-invariante\",\"categorySlug\":\"code\",\"title\":\"Formatos Comuns de Invariante\",\"navTitle\":\"Formatos Comuns de Invariante\",\"summary\":\"Catálogo dos formatos de invariante mais comuns em problemas de dois ponteiros, para reconhecer rapidamente qual se aplica a um problema novo.\",\"level\":\"intermediario\",\"order\":6,\"section\":\"two-pointers\",\"group\":\"Conceitos Centrais\",\"file\":\"code/formas-de-invariante.md\"},{\"slug\":\"mapa-mesma-direcao\",\"categorySlug\":\"code\",\"title\":\"Mapa da Família de Mesma Direção\",\"navTitle\":\"Mapa da Família de Mesma Direção\",\"summary\":\"Mapa dos problemas que usam ponteiros de mesma direção e como reconhecê-los pelo enunciado.\",\"level\":\"intermediario\",\"order\":7,\"section\":\"two-pointers\",\"group\":\"Mesma Direção\",\"file\":\"code/mapa-mesma-direcao.md\"},{\"slug\":\"remover-duplicatas\",\"categorySlug\":\"code\",\"title\":\"Remove Duplicates\",\"navTitle\":\"Remove Duplicates\",\"summary\":\"Remover duplicatas de um array ordenado in-place, usando um ponteiro de escrita e um ponteiro de leitura.\",\"level\":\"iniciante\",\"order\":8,\"section\":\"two-pointers\",\"group\":\"Mesma Direção\",\"file\":\"code/remover-duplicatas.md\"},{\"slug\":\"meio-lista-encadeada\",\"categorySlug\":\"code\",\"title\":\"Middle of a Linked List\",\"navTitle\":\"Middle of a Linked List\",\"summary\":\"Encontrar o nó do meio de uma lista encadeada em uma única passada, usando um ponteiro lento e um ponteiro rápido.\",\"level\":\"iniciante\",\"order\":9,\"section\":\"two-pointers\",\"group\":\"Mesma Direção\",\"file\":\"code/meio-lista-encadeada.md\"},{\"slug\":\"mover-zeros\",\"categorySlug\":\"code\",\"title\":\"Move Zeroes\",\"navTitle\":\"Move Zeroes\",\"summary\":\"Usar dois ponteiros na mesma direção (lento/rápido) para mover zeros ao fim do array in-place, preservando a ordem relativa.\",\"level\":\"iniciante\",\"order\":10,\"section\":\"two-pointers\",\"group\":\"Mesma Direção\",\"file\":\"code/mover-zeros.md\"},{\"slug\":\"remover-nth-do-fim\",\"categorySlug\":\"code\",\"title\":\"Remove N-th Node From End of List\",\"navTitle\":\"Remove N-th Node From End\",\"summary\":\"Remover o n-ésimo nó a partir do fim de uma lista encadeada em uma única passada, adiantando um ponteiro em n posições.\",\"level\":\"intermediario\",\"order\":11,\"section\":\"two-pointers\",\"group\":\"Mesma Direção\",\"file\":\"code/remover-nth-do-fim.md\"},{\"slug\":\"mapa-direcao-oposta\",\"categorySlug\":\"code\",\"title\":\"Mapa da Família de Direção Oposta\",\"navTitle\":\"Mapa da Família de Direção Oposta\",\"summary\":\"Mapa dos problemas que usam ponteiros convergentes e como reconhecê-los pelo enunciado.\",\"level\":\"intermediario\",\"order\":12,\"section\":\"two-pointers\",\"group\":\"Direção Oposta\",\"file\":\"code/mapa-direcao-oposta.md\"},{\"slug\":\"two-sum-ordenado\",\"categorySlug\":\"code\",\"title\":\"Two Sum Sorted\",\"navTitle\":\"Two Sum Sorted\",\"summary\":\"Encontrar um par que soma um alvo em um array ordenado, usando ponteiros convergentes para eliminar pares em O(n).\",\"level\":\"intermediario\",\"order\":13,\"section\":\"two-pointers\",\"group\":\"Direção Oposta\",\"file\":\"code/two-sum-ordenado.md\"},{\"slug\":\"palindromo-valido\",\"categorySlug\":\"code\",\"title\":\"Valid Palindrome\",\"navTitle\":\"Valid Palindrome\",\"summary\":\"Verificar se uma string é um palíndromo ignorando pontuação e caixa, comparando de fora para dentro com ponteiros convergentes.\",\"level\":\"iniciante\",\"order\":14,\"section\":\"two-pointers\",\"group\":\"Direção Oposta\",\"file\":\"code/palindromo-valido.md\"},{\"slug\":\"container-com-mais-agua\",\"categorySlug\":\"code\",\"title\":\"Container com Mais Água\",\"navTitle\":\"Container com Mais Água\",\"summary\":\"Aplicar ponteiros convergentes para encontrar o par de paredes que forma o maior reservatório de água possível.\",\"level\":\"intermediario\",\"order\":15,\"section\":\"two-pointers\",\"group\":\"Direção Oposta\",\"file\":\"code/container-com-mais-agua.md\"},{\"slug\":\"sliding-window\",\"categorySlug\":\"code\",\"title\":\"Sliding Window\",\"navTitle\":\"Introdução ao Sliding Window\",\"summary\":\"Reconhecer problemas de subarray ou substring contínua\",\"level\":\"intermediario\",\"order\":16,\"section\":\"two-pointers\",\"group\":\"Sliding Window\",\"file\":\"code/sliding-window.md\"},{\"slug\":\"mapa-sliding-window\",\"categorySlug\":\"code\",\"title\":\"Mapa da Família Sliding Window\",\"navTitle\":\"Sliding Window Family Map\",\"summary\":\"Mapa dos problemas de janela deslizante: tamanho fixo, mais longa e mais curta, e como reconhecer cada um.\",\"level\":\"intermediario\",\"order\":17,\"section\":\"two-pointers\",\"group\":\"Sliding Window\",\"file\":\"code/mapa-sliding-window.md\"},{\"slug\":\"soma-subarray-fixa\",\"categorySlug\":\"code\",\"title\":\"Subarray Sum - Fixed\",\"navTitle\":\"Subarray Sum - Fixed\",\"summary\":\"Encontrar a maior soma entre todos os subarrays de tamanho k reaproveitando a soma da janela anterior.\",\"level\":\"iniciante\",\"order\":18,\"section\":\"two-pointers\",\"group\":\"Sliding Window\",\"file\":\"code/soma-subarray-fixa.md\"},{\"slug\":\"anagramas-na-string\",\"categorySlug\":\"code\",\"title\":\"Find All Anagrams in a String\",\"navTitle\":\"Find All Anagrams in a String\",\"summary\":\"Janela de tamanho fixo com contagem de caracteres para achar todas as posições onde começa um anagrama de p.\",\"level\":\"intermediario\",\"order\":19,\"section\":\"two-pointers\",\"group\":\"Sliding Window\",\"file\":\"code/anagramas-na-string.md\"},{\"slug\":\"janela-mais-longa\",\"categorySlug\":\"code\",\"title\":\"Sliding Window - Longest\",\"navTitle\":\"Sliding Window - Longest\",\"summary\":\"Template de janela variável para achar o maior intervalo que satisfaz uma condição monotônica.\",\"level\":\"intermediario\",\"order\":20,\"section\":\"two-pointers\",\"group\":\"Sliding Window\",\"file\":\"code/janela-mais-longa.md\"},{\"slug\":\"substring-sem-repeticao\",\"categorySlug\":\"code\",\"title\":\"Longest Substring without Repeating Characters\",\"navTitle\":\"Longest Substring without Repeating Characters\",\"summary\":\"Janela variável com conjunto de caracteres para achar a maior substring sem letras repetidas.\",\"level\":\"intermediario\",\"order\":21,\"section\":\"two-pointers\",\"group\":\"Sliding Window\",\"file\":\"code/substring-sem-repeticao.md\"},{\"slug\":\"janela-mais-curta\",\"categorySlug\":\"code\",\"title\":\"Sliding Window - Shortest\",\"navTitle\":\"Sliding Window - Shortest\",\"summary\":\"Template de janela variável para achar o menor intervalo que satisfaz uma condição, contraindo enquanto ainda é válida.\",\"level\":\"intermediario\",\"order\":22,\"section\":\"two-pointers\",\"group\":\"Sliding Window\",\"file\":\"code/janela-mais-curta.md\"},{\"slug\":\"menor-sequencia-cartas-iguais\",\"categorySlug\":\"code\",\"title\":\"Least Consecutive Cards to Match\",\"navTitle\":\"Least Consecutive Cards to Match\",\"summary\":\"Achar o menor trecho consecutivo que contém duas cartas iguais, usando a última posição de cada valor.\",\"level\":\"intermediario\",\"order\":23,\"section\":\"two-pointers\",\"group\":\"Sliding Window\",\"file\":\"code/menor-sequencia-cartas-iguais.md\"},{\"slug\":\"prefix-sum-introducao\",\"categorySlug\":\"code\",\"title\":\"Prefix Sum: Introdução\",\"navTitle\":\"Introduction\",\"summary\":\"Pré-computar somas acumuladas para responder somas de intervalo em O(1).\",\"level\":\"iniciante\",\"order\":24,\"section\":\"two-pointers\",\"group\":\"Prefix Sum\",\"file\":\"code/prefix-sum-introducao.md\"},{\"slug\":\"subarray-soma-alvo\",\"categorySlug\":\"code\",\"title\":\"Subarray Sum Equals Target\",\"navTitle\":\"Subarray Sum Equals Target\",\"summary\":\"Contar subarrays com soma k usando prefix sum e hash map, inclusive com números negativos.\",\"level\":\"intermediario\",\"order\":25,\"section\":\"two-pointers\",\"group\":\"Prefix Sum\",\"file\":\"code/subarray-soma-alvo.md\"},{\"slug\":\"range-sum-query\",\"categorySlug\":\"code\",\"title\":\"Range Sum Query - Immutable\",\"navTitle\":\"Range Sum Query - Immutable\",\"summary\":\"Construir o array de prefixos uma vez e responder qualquer soma de intervalo em O(1).\",\"level\":\"iniciante\",\"order\":26,\"section\":\"two-pointers\",\"group\":\"Prefix Sum\",\"file\":\"code/range-sum-query.md\"},{\"slug\":\"produto-exceto-o-proprio\",\"categorySlug\":\"code\",\"title\":\"Product of Array Except Self\",\"navTitle\":\"Product of Array Except Self\",\"summary\":\"Prefixos e sufixos de produto para calcular, sem divisão, o produto de todos os elementos exceto o atual.\",\"level\":\"intermediario\",\"order\":27,\"section\":\"two-pointers\",\"group\":\"Prefix Sum\",\"file\":\"code/produto-exceto-o-proprio.md\"},{\"slug\":\"mapa-lento-rapido\",\"categorySlug\":\"code\",\"title\":\"Mapa da Família Lento e Rápido\",\"navTitle\":\"Fast and Slow Family Map\",\"summary\":\"Mapa dos problemas em que dois ponteiros andam em velocidades diferentes e como reconhecê-los.\",\"level\":\"intermediario\",\"order\":28,\"section\":\"two-pointers\",\"group\":\"Cycle Finding\",\"file\":\"code/mapa-lento-rapido.md\"},{\"slug\":\"ciclo-lista-encadeada\",\"categorySlug\":\"code\",\"title\":\"Linked List Cycle\",\"navTitle\":\"Linked List Cycle\",\"summary\":\"Detectar ciclo em lista encadeada com dois ponteiros de velocidades diferentes, em O(1) de espaço.\",\"level\":\"iniciante\",\"order\":29,\"section\":\"two-pointers\",\"group\":\"Cycle Finding\",\"file\":\"code/ciclo-lista-encadeada.md\"},{\"slug\":\"regra-decisao-two-pointers\",\"categorySlug\":\"code\",\"title\":\"Two Pointers Decision Rule\",\"navTitle\":\"Two Pointers Decision Rule\",\"summary\":\"Um roteiro para decidir qual variação de dois ponteiros usar diante de um enunciado novo.\",\"level\":\"intermediario\",\"order\":30,\"section\":\"two-pointers\",\"group\":\"Decision Making\",\"file\":\"code/regra-decisao-two-pointers.md\"},{\"slug\":\"minimum-window-substring\",\"categorySlug\":\"code\",\"title\":\"Minimum Window Substring\",\"navTitle\":\"Minimum Window Substring\",\"summary\":\"Menor janela de s que contém todos os caracteres de t, com contagem de faltantes.\",\"level\":\"avancado\",\"order\":31,\"section\":\"two-pointers\",\"group\":\"Advanced\",\"file\":\"code/minimum-window-substring.md\"},{\"slug\":\"teleporter-arrays\",\"categorySlug\":\"code\",\"title\":\"Teleporter Arrays\",\"navTitle\":\"Teleporter Arrays\",\"summary\":\"Dois arrays ordenados com valores em comum: somar o melhor caminho trocando de array nos pontos comuns.\",\"level\":\"avancado\",\"order\":32,\"section\":\"two-pointers\",\"group\":\"Advanced\",\"file\":\"code/teleporter-arrays.md\"},{\"slug\":\"sintese-two-pointers\",\"categorySlug\":\"code\",\"title\":\"Two Pointers Synthesis\",\"navTitle\":\"Two Pointers Synthesis\",\"summary\":\"Síntese de todas as variações de dois ponteiros, com o invariante de cada uma.\",\"level\":\"avancado\",\"order\":33,\"section\":\"two-pointers\",\"group\":\"Advanced\",\"file\":\"code/sintese-two-pointers.md\"},{\"slug\":\"speedrun-two-pointers\",\"categorySlug\":\"code\",\"title\":\"Two Pointers Speedrun\",\"navTitle\":\"Two Pointers Speedrun\",\"summary\":\"Revisão rápida: os templates de dois ponteiros em uma página, para consultar antes de treinar.\",\"level\":\"intermediario\",\"order\":34,\"section\":\"two-pointers\",\"group\":\"Speedrun\",\"file\":\"code/speedrun-two-pointers.md\"},{\"slug\":\"breakdown-two-pointers\",\"categorySlug\":\"code\",\"title\":\"Two Pointers: Breakdown de Problemas\",\"navTitle\":\"Monster Breakdown | Two Pointers\",\"summary\":\"Como quebrar um problema desconhecido de dois ponteiros em invariante, movimento e condição de parada.\",\"level\":\"avancado\",\"order\":35,\"section\":\"two-pointers\",\"group\":\"Speedrun\",\"file\":\"code/breakdown-two-pointers.md\"},{\"slug\":\"busca-binaria\",\"categorySlug\":\"code\",\"title\":\"Busca Binária\",\"summary\":\"Reconhecer problemas que se beneficiam de busca binária além da busca clássica em array ordenado\",\"level\":\"intermediario\",\"order\":36,\"section\":\"patterns\",\"file\":\"code/busca-binaria.md\"},{\"slug\":\"bfs-dfs\",\"categorySlug\":\"code\",\"title\":\"BFS/DFS em Grafos e Árvores\",\"summary\":\"Diferenciar quando usar BFS e quando usar DFS\",\"level\":\"intermediario\",\"order\":37,\"section\":\"patterns\",\"file\":\"code/bfs-dfs.md\"},{\"slug\":\"backtracking\",\"categorySlug\":\"code\",\"title\":\"Backtracking\",\"summary\":\"Reconhecer problemas que pedem todas as combinações/permutações possíveis satisfazendo uma condição\",\"level\":\"intermediario\",\"order\":38,\"section\":\"patterns\",\"file\":\"code/backtracking.md\"},{\"slug\":\"programacao-dinamica\",\"categorySlug\":\"code\",\"title\":\"Programação Dinâmica\",\"summary\":\"Reconhecer problemas com subestrutura ótima e subproblemas sobrepostos\",\"level\":\"intermediario\",\"order\":39,\"section\":\"patterns\",\"file\":\"code/programacao-dinamica.md\"},{\"slug\":\"heaps-filas-prioridade\",\"categorySlug\":\"code\",\"title\":\"Heaps e Filas de Prioridade\",\"summary\":\"Reconhecer problemas que se beneficiam de acesso eficiente ao menor/maior elemento\",\"level\":\"intermediario\",\"order\":40,\"section\":\"patterns\",\"file\":\"code/heaps-filas-prioridade.md\"},{\"slug\":\"pistas-no-enunciado\",\"categorySlug\":\"code\",\"title\":\"Pistas no Enunciado que Apontam para Cada Padrão\",\"summary\":\"Associar frases e estruturas comuns de enunciado a padrões específicos\",\"level\":\"intermediario\",\"order\":41,\"section\":\"pattern-recognition\",\"file\":\"code/pistas-no-enunciado.md\"},{\"slug\":\"exercicios-two-pointers-sliding-window\",\"categorySlug\":\"code\",\"title\":\"Exercícios: Two Pointers e Sliding Window\",\"navTitle\":\"Two Pointers e Sliding Window\",\"summary\":\"1. Dado um array ordenado, encontre se existem dois números cuja soma seja igual a um valor-alvo.\",\"level\":\"avancado\",\"order\":42,\"section\":\"practice\",\"file\":\"code/exercicios-two-pointers-sliding-window.md\"},{\"slug\":\"exercicios-grafos-arvores\",\"categorySlug\":\"code\",\"title\":\"Exercícios: BFS/DFS em Grafos e Árvores\",\"navTitle\":\"BFS/DFS em Grafos e Árvores\",\"summary\":\"1. Dado um grafo não ponderado, encontre o número mínimo de passos entre dois nós específicos.\",\"level\":\"avancado\",\"order\":43,\"section\":\"practice\",\"file\":\"code/exercicios-grafos-arvores.md\"},{\"slug\":\"exercicios-programacao-dinamica\",\"categorySlug\":\"code\",\"title\":\"Exercícios: Programação Dinâmica\",\"navTitle\":\"Programação Dinâmica\",\"summary\":\"1. Dado um conjunto de moedas de valores diferentes, encontre o número mínimo de moedas necessárias para totalizar um valor específico.\",\"level\":\"avancado\",\"order\":44,\"section\":\"practice\",\"file\":\"code/exercicios-programacao-dinamica.md\"},{\"slug\":\"exercicios-mistos\",\"categorySlug\":\"code\",\"title\":\"Exercícios Mistos de Revisão\",\"summary\":\"1. Encontre os k elementos mais frequentes em um array de números.\",\"level\":\"avancado\",\"order\":45,\"section\":\"practice\",\"file\":\"code/exercicios-mistos.md\"},{\"slug\":\"recursao-introducao\",\"categorySlug\":\"code\",\"title\":\"Recursão: Introdução\",\"navTitle\":\"Recursion Intro\",\"summary\":\"Caso base, passo recursivo e pilha de chamadas: o alicerce de toda busca em profundidade.\",\"level\":\"iniciante\",\"order\":46,\"section\":\"dfs\",\"group\":\"Introduction\",\"file\":\"code/recursao-introducao.md\"},{\"slug\":\"arvores-introducao\",\"categorySlug\":\"code\",\"title\":\"Árvores: Introdução\",\"navTitle\":\"Trees\",\"summary\":\"Vocabulário de árvores binárias e os três templates de travessia em profundidade.\",\"level\":\"iniciante\",\"order\":47,\"section\":\"dfs\",\"group\":\"Introduction\",\"file\":\"code/arvores-introducao.md\"},{\"slug\":\"dfs-introducao\",\"categorySlug\":\"code\",\"title\":\"DFS: Introdução\",\"navTitle\":\"DFS Intro\",\"summary\":\"Busca em profundidade: ir o mais fundo possível, voltar e tentar o próximo caminho — com templates recursivo, iterativo e com estado.\",\"level\":\"iniciante\",\"order\":48,\"section\":\"dfs\",\"group\":\"Introduction\",\"file\":\"code/dfs-introducao.md\"},{\"slug\":\"dfs-em-arvores-intro\",\"categorySlug\":\"code\",\"title\":\"DFS em Árvores: Introdução\",\"navTitle\":\"Intro\",\"summary\":\"Os dois estilos de DFS em árvores — devolver valores para cima ou passar estado para baixo — e como escolher.\",\"level\":\"intermediario\",\"order\":49,\"section\":\"dfs\",\"group\":\"DFS on Tree\",\"file\":\"code/dfs-em-arvores-intro.md\"},{\"slug\":\"profundidade-maxima\",\"categorySlug\":\"code\",\"title\":\"Max Depth of A Tree\",\"navTitle\":\"Max Depth of A Tree\",\"summary\":\"Calcular a altura de uma árvore binária com DFS bottom-up: 1 + o maior entre os filhos.\",\"level\":\"iniciante\",\"order\":50,\"section\":\"dfs\",\"group\":\"DFS on Tree\",\"file\":\"code/profundidade-maxima.md\"},{\"slug\":\"no-visivel\",\"categorySlug\":\"code\",\"title\":\"Visible Tree Node\",\"navTitle\":\"Visible Tree Node\",\"summary\":\"Contar nós que não têm ancestral maior, carregando o máximo do caminho como estado top-down.\",\"level\":\"intermediario\",\"order\":51,\"section\":\"dfs\",\"group\":\"DFS on Tree\",\"file\":\"code/no-visivel.md\"},{\"slug\":\"arvore-balanceada\",\"categorySlug\":\"code\",\"title\":\"Balanced Binary Tree\",\"navTitle\":\"Balanced Binary Tree\",\"summary\":\"Verificar se uma árvore é balanceada em O(n), devolvendo a altura ou -1 para sinalizar desbalanceamento.\",\"level\":\"intermediario\",\"order\":52,\"section\":\"dfs\",\"group\":\"DFS on Tree\",\"file\":\"code/arvore-balanceada.md\"},{\"slug\":\"subarvore-de-outra\",\"categorySlug\":\"code\",\"title\":\"Subtree of Another Tree\",\"navTitle\":\"Subtree of Another Tree\",\"summary\":\"Combinar duas DFS: percorrer a árvore principal e, em cada nó, testar se as duas árvores são idênticas.\",\"level\":\"intermediario\",\"order\":53,\"section\":\"dfs\",\"group\":\"DFS on Tree\",\"file\":\"code/subarvore-de-outra.md\"},{\"slug\":\"inverter-arvore\",\"categorySlug\":\"code\",\"title\":\"Invert Binary Tree\",\"navTitle\":\"Invert Binary Tree\",\"summary\":\"Espelhar uma árvore binária trocando esquerda e direita em cada nó com DFS pós-ordem.\",\"level\":\"iniciante\",\"order\":54,\"section\":\"dfs\",\"group\":\"DFS on Tree\",\"file\":\"code/inverter-arvore.md\"},{\"slug\":\"bst-introducao\",\"categorySlug\":\"code\",\"title\":\"Binary Search Tree: Introdução\",\"navTitle\":\"Binary Search Tree Intro\",\"summary\":\"O invariante da BST e os templates de busca, inserção e travessia em ordem.\",\"level\":\"intermediario\",\"order\":55,\"section\":\"dfs\",\"group\":\"Binary Search Tree\",\"file\":\"code/bst-introducao.md\"},{\"slug\":\"bst-valida\",\"categorySlug\":\"code\",\"title\":\"Valid Binary Search Tree\",\"navTitle\":\"Valid Binary Search Tree\",\"summary\":\"Validar uma BST passando limites (lo, hi) para baixo — o erro clássico é comparar só com o pai.\",\"level\":\"intermediario\",\"order\":56,\"section\":\"dfs\",\"group\":\"Binary Search Tree\",\"file\":\"code/bst-valida.md\"},{\"slug\":\"inserir-na-bst\",\"categorySlug\":\"code\",\"title\":\"Insert Into BST\",\"navTitle\":\"Insert Into BST\",\"summary\":\"Inserir um valor em uma BST descendo até a posição vazia e ligando o novo nó ao pai.\",\"level\":\"iniciante\",\"order\":57,\"section\":\"dfs\",\"group\":\"Binary Search Tree\",\"file\":\"code/inserir-na-bst.md\"},{\"slug\":\"lca-bst\",\"categorySlug\":\"code\",\"title\":\"Lowest Common Ancestor of a Binary Search Tree\",\"navTitle\":\"Lowest Common Ancestor of a BST\",\"summary\":\"Achar o menor ancestral comum em uma BST descendo até o primeiro nó que separa p e q.\",\"level\":\"intermediario\",\"order\":58,\"section\":\"dfs\",\"group\":\"Binary Search Tree\",\"file\":\"code/lca-bst.md\"},{\"slug\":\"reconstruir-preorder-inorder\",\"categorySlug\":\"code\",\"title\":\"Reconstruct Binary Tree from Preorder and Inorder Traversal\",\"navTitle\":\"Reconstruct from Preorder and Inorder\",\"summary\":\"Montar a árvore: o preorder entrega cada raiz e o inorder diz o que fica à esquerda e à direita.\",\"level\":\"avancado\",\"order\":59,\"section\":\"dfs\",\"group\":\"Advanced\",\"file\":\"code/reconstruir-preorder-inorder.md\"},{\"slug\":\"serializar-arvore\",\"categorySlug\":\"code\",\"title\":\"Serializing and Deserializing Binary Tree\",\"navTitle\":\"Serializing and Deserializing Binary Tree\",\"summary\":\"Transformar uma árvore em string e de volta usando pré-ordem com marcador de null.\",\"level\":\"avancado\",\"order\":60,\"section\":\"dfs\",\"group\":\"Advanced\",\"file\":\"code/serializar-arvore.md\"},{\"slug\":\"lca-arvore-binaria\",\"categorySlug\":\"code\",\"title\":\"Lowest Common Ancestor\",\"navTitle\":\"Lowest Common Ancestor\",\"summary\":\"LCA em árvore binária qualquer com DFS bottom-up: o primeiro nó que recebe um alvo de cada lado.\",\"level\":\"avancado\",\"order\":61,\"section\":\"dfs\",\"group\":\"Advanced\",\"file\":\"code/lca-arvore-binaria.md\"},{\"slug\":\"bfs-introducao\",\"categorySlug\":\"code\",\"title\":\"BFS: Introdução\",\"navTitle\":\"BFS Intro\",\"summary\":\"Busca em largura: explorar camada por camada com uma fila, e os templates que você vai reaproveitar em árvores, grades e grafos.\",\"level\":\"iniciante\",\"order\":62,\"section\":\"bfs\",\"group\":\"Introduction\",\"file\":\"code/bfs-introducao.md\"},{\"slug\":\"bfs-caminho-mais-curto\",\"categorySlug\":\"code\",\"title\":\"Caminho Mais Curto com BFS\",\"navTitle\":\"Shortest Path Intro\",\"summary\":\"Por que a BFS encontra o menor caminho em grafos não ponderados e como reconstruí-lo com o vetor parent.\",\"level\":\"iniciante\",\"order\":63,\"section\":\"bfs\",\"group\":\"Introduction\",\"file\":\"code/bfs-caminho-mais-curto.md\"},{\"slug\":\"ordem-por-niveis\",\"categorySlug\":\"code\",\"title\":\"Binary Tree Level Order Traversal\",\"navTitle\":\"Level Order Traversal\",\"summary\":\"O template de BFS em árvores: uma fatia da fila por nível, devolvendo uma lista por nível.\",\"level\":\"iniciante\",\"order\":64,\"section\":\"bfs\",\"group\":\"BFS on Tree\",\"file\":\"code/ordem-por-niveis.md\"},{\"slug\":\"visao-lado-direito\",\"categorySlug\":\"code\",\"title\":\"Binary Tree Right Side View\",\"navTitle\":\"Right Side View\",\"summary\":\"Level order guardando só o último nó de cada nível: o que você vê ao olhar a árvore pela direita.\",\"level\":\"intermediario\",\"order\":65,\"section\":\"bfs\",\"group\":\"BFS on Tree\",\"file\":\"code/visao-lado-direito.md\"},{\"slug\":\"profundidade-minima\",\"categorySlug\":\"code\",\"title\":\"Minimum Depth of Binary Tree\",\"navTitle\":\"Minimum Depth\",\"summary\":\"A BFS encerra na primeira folha: o exemplo clássico de parar cedo por causa da ordem por níveis.\",\"level\":\"iniciante\",\"order\":66,\"section\":\"bfs\",\"group\":\"BFS on Tree\",\"file\":\"code/profundidade-minima.md\"},{\"slug\":\"zigzag-por-niveis\",\"categorySlug\":\"code\",\"title\":\"Binary Tree Zigzag Level Order Traversal\",\"navTitle\":\"Zigzag Level Order\",\"summary\":\"Level order alternando o sentido de leitura a cada nível, sem mudar a ordem em que a fila é processada.\",\"level\":\"intermediario\",\"order\":67,\"section\":\"bfs\",\"group\":\"BFS on Tree\",\"file\":\"code/zigzag-por-niveis.md\"},{\"slug\":\"numero-de-ilhas\",\"categorySlug\":\"code\",\"title\":\"Number of Islands\",\"navTitle\":\"Number of Islands\",\"summary\":\"BFS como flood fill: cada nova terra não visitada é uma ilha, e a BFS marca a ilha inteira.\",\"level\":\"intermediario\",\"order\":68,\"section\":\"bfs\",\"group\":\"BFS on Grid\",\"file\":\"code/numero-de-ilhas.md\"},{\"slug\":\"caminho-minimo-labirinto\",\"categorySlug\":\"code\",\"title\":\"Shortest Path in a Maze\",\"navTitle\":\"Shortest Path in a Maze\",\"summary\":\"BFS em grade com distância por célula: o menor número de passos entre a entrada e a saída de um labirinto.\",\"level\":\"intermediario\",\"order\":69,\"section\":\"bfs\",\"group\":\"BFS on Grid\",\"file\":\"code/caminho-minimo-labirinto.md\"},{\"slug\":\"laranjas-podres\",\"categorySlug\":\"code\",\"title\":\"Rotting Oranges\",\"navTitle\":\"Rotting Oranges\",\"summary\":\"BFS multi-fonte por níveis: todas as laranjas podres contaminam ao mesmo tempo, e cada nível é um minuto.\",\"level\":\"intermediario\",\"order\":70,\"section\":\"bfs\",\"group\":\"BFS on Grid\",\"file\":\"code/laranjas-podres.md\"},{\"slug\":\"word-ladder\",\"categorySlug\":\"code\",\"title\":\"Word Ladder\",\"navTitle\":\"Word Ladder\",\"summary\":\"BFS em um grafo implícito: palavras são nós e duas palavras são vizinhas se diferem em uma letra.\",\"level\":\"avancado\",\"order\":71,\"section\":\"bfs\",\"group\":\"BFS on Graph\",\"file\":\"code/word-ladder.md\"},{\"slug\":\"ordenacao-topologica\",\"categorySlug\":\"code\",\"title\":\"Topological Sort\",\"navTitle\":\"Topological Sort\",\"summary\":\"Ordenar tarefas com dependências usando BFS e graus de entrada (algoritmo de Kahn).\",\"level\":\"avancado\",\"order\":72,\"section\":\"bfs\",\"group\":\"Advanced\",\"file\":\"code/ordenacao-topologica.md\"},{\"slug\":\"cursos-e-prerequisitos\",\"categorySlug\":\"code\",\"title\":\"Course Schedule\",\"navTitle\":\"Course Schedule\",\"summary\":\"Detectar ciclo em um grafo direcionado com Kahn: se nem todos os nós saem da fila, existe ciclo.\",\"level\":\"avancado\",\"order\":73,\"section\":\"bfs\",\"group\":\"Advanced\",\"file\":\"code/cursos-e-prerequisitos.md\"},{\"slug\":\"bfs-sintese\",\"categorySlug\":\"code\",\"title\":\"BFS: Síntese\",\"navTitle\":\"BFS Synthesis\",\"summary\":\"Resumo de todos os padrões de BFS, com quando usar cada um e um checklist antes de codar.\",\"level\":\"avancado\",\"order\":74,\"section\":\"bfs\",\"group\":\"Advanced\",\"file\":\"code/bfs-sintese.md\"},{\"slug\":\"o-que-e-low-level-design\",\"categorySlug\":\"low-level-design\",\"title\":\"O que é Low Level Design\",\"navTitle\":\"O que é Low Level Design\",\"summary\":\"Entender o que a entrevista de LLD avalia e como ela difere de System Design\",\"level\":\"iniciante\",\"order\":1,\"section\":\"fundamentos\",\"file\":\"low-level-design/o-que-e-low-level-design.md\"},{\"slug\":\"pilares-poo-revisao\",\"categorySlug\":\"low-level-design\",\"title\":\"Revisão: os Quatro Pilares da Orientação a Objetos\",\"navTitle\":\"Revisão dos Pilares de POO\",\"summary\":\"Revisar encapsulamento, abstração, herança e polimorfismo em Java como base para o resto do curso\",\"level\":\"iniciante\",\"order\":2,\"section\":\"fundamentos\",\"file\":\"low-level-design/pilares-poo-revisao.md\"},{\"slug\":\"nomes-significativos\",\"categorySlug\":\"low-level-design\",\"title\":\"Clean Code: Nomes Significativos\",\"navTitle\":\"Nomes Significativos\",\"summary\":\"Escolher nomes de variáveis, métodos e classes que comunicam intenção sem precisar de comentário\",\"level\":\"iniciante\",\"order\":3,\"section\":\"clean-code\",\"file\":\"low-level-design/nomes-significativos.md\"},{\"slug\":\"funcoes-pequenas-e-coesas\",\"categorySlug\":\"low-level-design\",\"title\":\"Clean Code: Funções Pequenas e Coesas\",\"navTitle\":\"Funções Pequenas e Coesas\",\"summary\":\"Escrever funções que fazem uma coisa só, num único nível de abstração\",\"level\":\"iniciante\",\"order\":4,\"section\":\"clean-code\",\"file\":\"low-level-design/funcoes-pequenas-e-coesas.md\"},{\"slug\":\"comentarios-e-formatacao\",\"categorySlug\":\"low-level-design\",\"title\":\"Clean Code: Comentários e Formatação\",\"navTitle\":\"Comentários e Formatação\",\"summary\":\"Usar comentários só quando o código não pode falar por si, e manter formatação consistente\",\"level\":\"iniciante\",\"order\":5,\"section\":\"clean-code\",\"file\":\"low-level-design/comentarios-e-formatacao.md\"},{\"slug\":\"tratamento-de-erros\",\"categorySlug\":\"low-level-design\",\"title\":\"Clean Code: Tratamento de Erros\",\"navTitle\":\"Tratamento de Erros\",\"summary\":\"Usar exceptions em vez de códigos de erro, e não deixar o tratamento de erro esconder a lógica principal\",\"level\":\"iniciante\",\"order\":6,\"section\":\"clean-code\",\"file\":\"low-level-design/tratamento-de-erros.md\"},{\"slug\":\"classes-coesas-e-acopladas\",\"categorySlug\":\"low-level-design\",\"title\":\"Clean Code: Coesão e Acoplamento em Classes\",\"navTitle\":\"Coesão e Acoplamento\",\"summary\":\"Entender coesão alta e acoplamento baixo como a ponte entre Clean Code e SOLID\",\"level\":\"intermediario\",\"order\":7,\"section\":\"clean-code\",\"file\":\"low-level-design/classes-coesas-e-acopladas.md\"},{\"slug\":\"srp-responsabilidade-unica\",\"categorySlug\":\"low-level-design\",\"title\":\"SOLID: Princípio da Responsabilidade Única (SRP)\",\"navTitle\":\"S — Responsabilidade Única\",\"summary\":\"Uma classe deve ter apenas um motivo para mudar\",\"level\":\"intermediario\",\"order\":8,\"section\":\"solid\",\"file\":\"low-level-design/srp-responsabilidade-unica.md\"},{\"slug\":\"ocp-aberto-fechado\",\"categorySlug\":\"low-level-design\",\"title\":\"SOLID: Princípio Aberto/Fechado (OCP)\",\"navTitle\":\"O — Aberto/Fechado\",\"summary\":\"Aberto para extensão, fechado para modificação\",\"level\":\"intermediario\",\"order\":9,\"section\":\"solid\",\"file\":\"low-level-design/ocp-aberto-fechado.md\"},{\"slug\":\"lsp-substituicao-de-liskov\",\"categorySlug\":\"low-level-design\",\"title\":\"SOLID: Princípio da Substituição de Liskov (LSP)\",\"navTitle\":\"L — Substituição de Liskov\",\"summary\":\"Uma subclasse deve poder substituir sua superclasse sem quebrar o comportamento esperado\",\"level\":\"intermediario\",\"order\":10,\"section\":\"solid\",\"file\":\"low-level-design/lsp-substituicao-de-liskov.md\"},{\"slug\":\"isp-segregacao-de-interfaces\",\"categorySlug\":\"low-level-design\",\"title\":\"SOLID: Princípio da Segregação de Interfaces (ISP)\",\"navTitle\":\"I — Segregação de Interfaces\",\"summary\":\"Nenhum cliente deve ser forçado a depender de métodos que não usa\",\"level\":\"intermediario\",\"order\":11,\"section\":\"solid\",\"file\":\"low-level-design/isp-segregacao-de-interfaces.md\"},{\"slug\":\"dip-inversao-de-dependencia\",\"categorySlug\":\"low-level-design\",\"title\":\"SOLID: Princípio da Inversão de Dependência (DIP)\",\"navTitle\":\"D — Inversão de Dependência\",\"summary\":\"Dependa de abstrações, não de implementações concretas\",\"level\":\"intermediario\",\"order\":12,\"section\":\"solid\",\"file\":\"low-level-design/dip-inversao-de-dependencia.md\"},{\"slug\":\"singleton\",\"categorySlug\":\"low-level-design\",\"title\":\"Padrão Singleton\",\"navTitle\":\"Singleton\",\"summary\":\"Garantir que uma classe tenha uma única instância e fornecer um ponto de acesso global a ela\",\"level\":\"intermediario\",\"order\":13,\"section\":\"padroes-criacionais\",\"file\":\"low-level-design/singleton.md\"},{\"slug\":\"factory-method\",\"categorySlug\":\"low-level-design\",\"title\":\"Padrão Factory Method\",\"navTitle\":\"Factory Method\",\"summary\":\"Delegar a criação de objetos a subclasses, sem acoplar o código cliente a classes concretas\",\"level\":\"intermediario\",\"order\":14,\"section\":\"padroes-criacionais\",\"file\":\"low-level-design/factory-method.md\"},{\"slug\":\"builder\",\"categorySlug\":\"low-level-design\",\"title\":\"Padrão Builder\",\"navTitle\":\"Builder\",\"summary\":\"Construir objetos complexos passo a passo, evitando construtores com muitos parâmetros\",\"level\":\"intermediario\",\"order\":15,\"section\":\"padroes-criacionais\",\"file\":\"low-level-design/builder.md\"},{\"slug\":\"adapter\",\"categorySlug\":\"low-level-design\",\"title\":\"Padrão Adapter\",\"navTitle\":\"Adapter\",\"summary\":\"Encaixar uma interface existente e incompatível na interface que o código cliente espera\",\"level\":\"intermediario\",\"order\":16,\"section\":\"padroes-estruturais\",\"file\":\"low-level-design/adapter.md\"},{\"slug\":\"decorator\",\"categorySlug\":\"low-level-design\",\"title\":\"Padrão Decorator\",\"navTitle\":\"Decorator\",\"summary\":\"Adicionar comportamento a um objeto dinamicamente, envolvendo-o em camadas, sem herança\",\"level\":\"intermediario\",\"order\":17,\"section\":\"padroes-estruturais\",\"file\":\"low-level-design/decorator.md\"},{\"slug\":\"facade\",\"categorySlug\":\"low-level-design\",\"title\":\"Padrão Facade\",\"navTitle\":\"Facade\",\"summary\":\"Fornecer uma interface simples e única para um conjunto de subsistemas complexos\",\"level\":\"intermediario\",\"order\":18,\"section\":\"padroes-estruturais\",\"file\":\"low-level-design/facade.md\"},{\"slug\":\"proxy\",\"categorySlug\":\"low-level-design\",\"title\":\"Padrão Proxy\",\"navTitle\":\"Proxy\",\"summary\":\"Controlar o acesso a um objeto através de um substituto que implementa a mesma interface\",\"level\":\"intermediario\",\"order\":19,\"section\":\"padroes-estruturais\",\"file\":\"low-level-design/proxy.md\"},{\"slug\":\"composite\",\"categorySlug\":\"low-level-design\",\"title\":\"Padrão Composite\",\"navTitle\":\"Composite\",\"summary\":\"Compor objetos em estruturas de árvore e tratar objetos individuais e composições de forma uniforme\",\"level\":\"intermediario\",\"order\":20,\"section\":\"padroes-estruturais\",\"file\":\"low-level-design/composite.md\"},{\"slug\":\"observer\",\"categorySlug\":\"low-level-design\",\"title\":\"Padrão Observer\",\"navTitle\":\"Observer\",\"summary\":\"Notificar automaticamente um conjunto de objetos interessados quando o estado de outro objeto muda\",\"level\":\"intermediario\",\"order\":21,\"section\":\"padroes-comportamentais\",\"file\":\"low-level-design/observer.md\"},{\"slug\":\"strategy\",\"categorySlug\":\"low-level-design\",\"title\":\"Padrão Strategy\",\"navTitle\":\"Strategy\",\"summary\":\"Definir uma família de algoritmos intercambiáveis, encapsulados em classes separadas\",\"level\":\"intermediario\",\"order\":22,\"section\":\"padroes-comportamentais\",\"file\":\"low-level-design/strategy.md\"},{\"slug\":\"state\",\"categorySlug\":\"low-level-design\",\"title\":\"Padrão State\",\"navTitle\":\"State\",\"summary\":\"Permitir que um objeto altere seu comportamento quando seu estado interno muda\",\"level\":\"intermediario\",\"order\":23,\"section\":\"padroes-comportamentais\",\"file\":\"low-level-design/state.md\"},{\"slug\":\"command\",\"categorySlug\":\"low-level-design\",\"title\":\"Padrão Command\",\"navTitle\":\"Command\",\"summary\":\"Encapsular uma solicitação como um objeto, permitindo enfileirar, desfazer e registrar histórico de ações\",\"level\":\"intermediario\",\"order\":24,\"section\":\"padroes-comportamentais\",\"file\":\"low-level-design/command.md\"},{\"slug\":\"template-method\",\"categorySlug\":\"low-level-design\",\"title\":\"Padrão Template Method\",\"navTitle\":\"Template Method\",\"summary\":\"Definir o esqueleto de um algoritmo na superclasse, deixando passos específicos para as subclasses\",\"level\":\"intermediario\",\"order\":25,\"section\":\"padroes-comportamentais\",\"file\":\"low-level-design/template-method.md\"},{\"slug\":\"iterator\",\"categorySlug\":\"low-level-design\",\"title\":\"Padrão Iterator\",\"navTitle\":\"Iterator\",\"summary\":\"Percorrer os elementos de uma coleção sem expor sua representação interna\",\"level\":\"intermediario\",\"order\":26,\"section\":\"padroes-comportamentais\",\"file\":\"low-level-design/iterator.md\"},{\"slug\":\"como-escolher-o-padrao-certo\",\"categorySlug\":\"low-level-design\",\"title\":\"Síntese: Como Escolher o Padrão Certo\",\"navTitle\":\"Como Escolher o Padrão Certo\",\"summary\":\"Comparar padrões que se confundem e montar um guia de decisão para entrevista\",\"level\":\"avancado\",\"order\":27,\"section\":\"sintese\",\"file\":\"low-level-design/como-escolher-o-padrao-certo.md\"},{\"slug\":\"orientacao-o-que-e-avaliado\",\"categorySlug\":\"ml-system-design\",\"title\":\"Orientação: O que essa Entrevista Avalia\",\"navTitle\":\"Orientação\",\"summary\":\"Diferenciar ML System Design de System Design tradicional e de uma prova teórica de ML\",\"level\":\"intermediario\",\"order\":1,\"section\":\"framework\",\"file\":\"ml-system-design/orientacao-o-que-e-avaliado.md\"},{\"slug\":\"objetivo-negocio-para-objetivo-ml\",\"categorySlug\":\"ml-system-design\",\"title\":\"Do Objetivo de Negócio ao Objetivo de ML\",\"summary\":\"Traduzir um objetivo de negócio vago em uma métrica de ML bem definida\",\"level\":\"intermediario\",\"order\":2,\"section\":\"framework\",\"file\":\"ml-system-design/objetivo-negocio-para-objetivo-ml.md\"},{\"slug\":\"dados-fontes-rotulos-qualidade\",\"categorySlug\":\"ml-system-design\",\"title\":\"Dados: Fontes, Rótulos e Qualidade\",\"navTitle\":\"Dados\",\"summary\":\"Identificar possíveis fontes de dados e rótulos para um problema de ML\",\"level\":\"intermediario\",\"order\":3,\"section\":\"framework\",\"file\":\"ml-system-design/dados-fontes-rotulos-qualidade.md\"},{\"slug\":\"engenharia-features\",\"categorySlug\":\"ml-system-design\",\"title\":\"Engenharia de Features\",\"summary\":\"Categorizar features por origem e temporalidade\",\"level\":\"intermediario\",\"order\":4,\"section\":\"framework\",\"file\":\"ml-system-design/engenharia-features.md\"},{\"slug\":\"selecao-treinamento-modelo\",\"categorySlug\":\"ml-system-design\",\"title\":\"Seleção e Treinamento de Modelo\",\"summary\":\"Justificar a escolha de um modelo com base nos requisitos do problema, não em modismo\",\"level\":\"intermediario\",\"order\":5,\"section\":\"framework\",\"file\":\"ml-system-design/selecao-treinamento-modelo.md\"},{\"slug\":\"avaliacao-offline-online\",\"categorySlug\":\"ml-system-design\",\"title\":\"Avaliação Offline e Online\",\"summary\":\"Diferenciar avaliação offline de avaliação online\",\"level\":\"intermediario\",\"order\":6,\"section\":\"framework\",\"file\":\"ml-system-design/avaliacao-offline-online.md\"},{\"slug\":\"deploy-monitoramento-feedback\",\"categorySlug\":\"ml-system-design\",\"title\":\"Deploy, Monitoramento e Feedback Loop\",\"summary\":\"Considerar o ciclo de vida do modelo após o deploy inicial\",\"level\":\"intermediario\",\"order\":7,\"section\":\"framework\",\"file\":\"ml-system-design/deploy-monitoramento-feedback.md\"},{\"slug\":\"trade-offs-modelos-simples-complexos\",\"categorySlug\":\"ml-system-design\",\"title\":\"Trade-offs entre Modelos Simples e Complexos\",\"summary\":\"Articular os trade-offs entre complexidade de modelo e viabilidade prática\",\"level\":\"intermediario\",\"order\":8,\"section\":\"core-concepts\",\"file\":\"ml-system-design/trade-offs-modelos-simples-complexos.md\"},{\"slug\":\"vazamento-de-dados\",\"categorySlug\":\"ml-system-design\",\"title\":\"Vazamento de Dados (Data Leakage)\",\"navTitle\":\"Vazamento de Dados\",\"summary\":\"Reconhecer o que é vazamento de dados e por que ele infla métricas de forma enganosa\",\"level\":\"intermediario\",\"order\":9,\"section\":\"core-concepts\",\"file\":\"ml-system-design/vazamento-de-dados.md\"},{\"slug\":\"desbalanceamento-classes\",\"categorySlug\":\"ml-system-design\",\"title\":\"Desbalanceamento de Classes\",\"summary\":\"Reconhecer o problema de classes desbalanceadas em problemas de classificação\",\"level\":\"intermediario\",\"order\":10,\"section\":\"core-concepts\",\"file\":\"ml-system-design/desbalanceamento-classes.md\"},{\"slug\":\"sistema-recomendacao\",\"categorySlug\":\"ml-system-design\",\"title\":\"Exercício: Sistema de Recomendação\",\"navTitle\":\"Sistema de Recomendação\",\"summary\":\"Projete um sistema de recomendação de conteúdo (vídeos, produtos, ou posts) para os usuários de uma plataforma.\",\"level\":\"avancado\",\"order\":11,\"section\":\"question-breakdowns\",\"file\":\"ml-system-design/sistema-recomendacao.md\"},{\"slug\":\"deteccao-fraude-bot\",\"categorySlug\":\"ml-system-design\",\"title\":\"Exercício: Detecção de Fraude ou Bot\",\"navTitle\":\"Detecção de Fraude ou Bot\",\"summary\":\"Projete um sistema que identifica contas fraudulentas ou automatizadas (bots) em uma plataforma online.\",\"level\":\"avancado\",\"order\":12,\"section\":\"question-breakdowns\",\"file\":\"ml-system-design/deteccao-fraude-bot.md\"},{\"slug\":\"feed-ranqueado\",\"categorySlug\":\"ml-system-design\",\"title\":\"Exercício: Feed Ranqueado\",\"navTitle\":\"Feed Ranqueado\",\"summary\":\"Projete o sistema de ranqueamento de um feed social, decidindo a ordem em que posts são exibidos a cada usuário.\",\"level\":\"avancado\",\"order\":13,\"section\":\"question-breakdowns\",\"file\":\"ml-system-design/feed-ranqueado.md\"},{\"slug\":\"moderacao-conteudo\",\"categorySlug\":\"ml-system-design\",\"title\":\"Exercício: Moderação de Conteúdo\",\"navTitle\":\"Moderação de Conteúdo\",\"summary\":\"Projete um sistema que identifica automaticamente conteúdo potencialmente prejudicial (discurso de ódio, violência, spam) postado por usuários em uma plataforma.\",\"level\":\"avancado\",\"order\":14,\"section\":\"question-breakdowns\",\"file\":\"ml-system-design/moderacao-conteudo.md\"},{\"slug\":\"orientacao\",\"categorySlug\":\"system-design\",\"title\":\"Orientação: como funciona uma entrevista de system design\",\"navTitle\":\"Orientação\",\"summary\":\"Entender o que um entrevistador de system design está avaliando de fato\",\"level\":\"intermediario\",\"order\":1,\"section\":\"framework-entrega\",\"group\":\"Começando\",\"file\":\"system-design/orientacao.md\"},{\"slug\":\"levantamento-requisitos\",\"categorySlug\":\"system-design\",\"title\":\"Levantamento de Requisitos (Funcionais e Não-Funcionais)\",\"navTitle\":\"Levantamento de Requisitos\",\"summary\":\"Diferenciar requisitos funcionais de não-funcionais\",\"level\":\"intermediario\",\"order\":2,\"section\":\"framework-entrega\",\"group\":\"Começando\",\"file\":\"system-design/levantamento-requisitos.md\"},{\"slug\":\"estimativas-capacidade\",\"categorySlug\":\"system-design\",\"title\":\"Estimativas de Capacidade: quando vale a pena calcular\",\"navTitle\":\"Estimativas de Capacidade\",\"summary\":\"Saber quando estimativas de capacidade agregam valor à entrevista\",\"level\":\"intermediario\",\"order\":3,\"section\":\"framework-entrega\",\"group\":\"Planejar\",\"file\":\"system-design/estimativas-capacidade.md\"},{\"slug\":\"contrato-api\",\"categorySlug\":\"system-design\",\"title\":\"Definindo o Contrato de API\",\"summary\":\"Traduzir requisitos funcionais em endpoints concretos\",\"level\":\"intermediario\",\"order\":4,\"section\":\"framework-entrega\",\"group\":\"Planejar\",\"file\":\"system-design/contrato-api.md\"},{\"slug\":\"modelagem-dados\",\"categorySlug\":\"system-design\",\"title\":\"Modelagem de Dados\",\"summary\":\"Identificar as principais entidades do sistema e seus relacionamentos\",\"level\":\"intermediario\",\"order\":5,\"section\":\"framework-entrega\",\"group\":\"Planejar\",\"file\":\"system-design/modelagem-dados.md\"},{\"slug\":\"desenho-alto-nivel\",\"categorySlug\":\"system-design\",\"title\":\"Desenho de Alto Nível\",\"summary\":\"Montar um diagrama de componentes que atenda aos requisitos já levantados\",\"level\":\"intermediario\",\"order\":6,\"section\":\"framework-entrega\",\"group\":\"Desenhar e aprofundar\",\"file\":\"system-design/desenho-alto-nivel.md\"},{\"slug\":\"deep-dives\",\"categorySlug\":\"system-design\",\"title\":\"Deep Dives: aprofundando nos pontos críticos\",\"navTitle\":\"Deep Dives\",\"summary\":\"Escolher quais pontos do sistema merecem aprofundamento\",\"level\":\"intermediario\",\"order\":7,\"section\":\"framework-entrega\",\"group\":\"Desenhar e aprofundar\",\"file\":\"system-design/deep-dives.md\"},{\"slug\":\"erros-comuns\",\"categorySlug\":\"system-design\",\"title\":\"Erros Comuns e Como Evitá-los\",\"summary\":\"Reconhecer os erros mais frequentes em cada etapa do framework\",\"level\":\"intermediario\",\"order\":8,\"section\":\"framework-entrega\",\"group\":\"Desenhar e aprofundar\",\"file\":\"system-design/erros-comuns.md\"},{\"slug\":\"fundamentos-rede\",\"categorySlug\":\"system-design\",\"title\":\"Fundamentos de Rede (DNS, Load Balancers, Proxies)\",\"navTitle\":\"Fundamentos de Rede\",\"summary\":\"Entender o caminho de uma requisição pela rede: DNS, load balancers de camada 4 e 7 e proxies direto e reverso\",\"level\":\"intermediario\",\"order\":9,\"section\":\"tecnologias-chave\",\"group\":\"Rede e APIs\",\"file\":\"system-design/fundamentos-rede.md\"},{\"slug\":\"design-api\",\"categorySlug\":\"system-design\",\"title\":\"Design de API: REST, GraphQL e RPC\",\"navTitle\":\"Design de API\",\"summary\":\"Entender o modelo de recursos do REST, quando GraphQL resolve um problema real e o papel do RPC entre serviços internos\",\"level\":\"intermediario\",\"order\":10,\"section\":\"tecnologias-chave\",\"group\":\"Rede e APIs\",\"file\":\"system-design/design-api.md\"},{\"slug\":\"bancos-dados\",\"categorySlug\":\"system-design\",\"title\":\"Bancos de Dados: Relacional vs. Documento vs. Chave-Valor\",\"navTitle\":\"Bancos de Dados\",\"summary\":\"Entender o modelo de cada tipo de banco, o que ele garante e como escolher pelo padrão de acesso aos dados\",\"level\":\"intermediario\",\"order\":11,\"section\":\"tecnologias-chave\",\"group\":\"Armazenamento e desempenho\",\"file\":\"system-design/bancos-dados.md\"},{\"slug\":\"indexacao\",\"categorySlug\":\"system-design\",\"title\":\"Indexação de Banco de Dados\",\"summary\":\"Entender por que índices aceleram leituras, quanto custam nas escritas e quando propô-los\",\"level\":\"intermediario\",\"order\":12,\"section\":\"tecnologias-chave\",\"group\":\"Armazenamento e desempenho\",\"file\":\"system-design/indexacao.md\"},{\"slug\":\"cache\",\"categorySlug\":\"system-design\",\"title\":\"Cache: Estratégias, Invalidação e Camadas\",\"navTitle\":\"Cache\",\"summary\":\"Entender o que é um cache, as estratégias de leitura e escrita, o problema da invalidação e onde colocar cada camada\",\"level\":\"intermediario\",\"order\":13,\"section\":\"tecnologias-chave\",\"group\":\"Armazenamento e desempenho\",\"file\":\"system-design/cache.md\"},{\"slug\":\"sharding\",\"categorySlug\":\"system-design\",\"title\":\"Sharding e Particionamento\",\"summary\":\"Entender por que um único banco deixa de escalar, as estratégias de particionamento e os problemas que o sharding cria\",\"level\":\"intermediario\",\"order\":14,\"section\":\"tecnologias-chave\",\"group\":\"Escala e distribuição\",\"file\":\"system-design/sharding.md\"},{\"slug\":\"consistent-hashing\",\"categorySlug\":\"system-design\",\"title\":\"Consistent Hashing\",\"summary\":\"Entender o problema do hash por módulo ao escalar e como o anel de consistent hashing o resolve\",\"level\":\"intermediario\",\"order\":15,\"section\":\"tecnologias-chave\",\"group\":\"Escala e distribuição\",\"file\":\"system-design/consistent-hashing.md\"},{\"slug\":\"teorema-cap\",\"categorySlug\":\"system-design\",\"title\":\"Teorema CAP e Consistência\",\"summary\":\"Entender os três elementos do teorema CAP, por que a escolha real é entre consistência e disponibilidade durante uma partição, e como isso guia decisões\",\"level\":\"intermediario\",\"order\":16,\"section\":\"tecnologias-chave\",\"group\":\"Escala e distribuição\",\"file\":\"system-design/teorema-cap.md\"},{\"slug\":\"filas-mensageria\",\"categorySlug\":\"system-design\",\"title\":\"Filas e Sistemas de Mensageria\",\"summary\":\"Entender o papel das filas no desacoplamento entre serviços, as garantias de entrega e quando uma fila resolve um problema real\",\"level\":\"intermediario\",\"order\":17,\"section\":\"tecnologias-chave\",\"group\":\"Mensageria e estimativas\",\"file\":\"system-design/filas-mensageria.md\"},{\"slug\":\"numeros-para-saber\",\"categorySlug\":\"system-design\",\"title\":\"Números que Todo Engenheiro Deveria Saber\",\"summary\":\"Ter referências de ordem de grandeza para latências, capacidades e unidades, e usá-las para estimar e decidir\",\"level\":\"intermediario\",\"order\":18,\"section\":\"tecnologias-chave\",\"group\":\"Mensageria e estimativas\",\"file\":\"system-design/numeros-para-saber.md\"},{\"slug\":\"escalabilidade\",\"categorySlug\":\"system-design\",\"title\":\"Escalabilidade: Vertical vs. Horizontal\",\"navTitle\":\"Escalabilidade\",\"summary\":\"Diferenciar escalabilidade vertical e horizontal\",\"level\":\"intermediario\",\"order\":19,\"section\":\"conceitos-centrais\",\"group\":\"Fundamentos de sistemas distribuídos\",\"file\":\"system-design/escalabilidade.md\"},{\"slug\":\"disponibilidade-tolerancia-falhas\",\"categorySlug\":\"system-design\",\"title\":\"Disponibilidade e Tolerância a Falhas\",\"summary\":\"Entender como disponibilidade costuma ser medida\",\"level\":\"intermediario\",\"order\":20,\"section\":\"conceitos-centrais\",\"group\":\"Fundamentos de sistemas distribuídos\",\"file\":\"system-design/disponibilidade-tolerancia-falhas.md\"},{\"slug\":\"consistencia\",\"categorySlug\":\"system-design\",\"title\":\"Consistência: Forte, Eventual e Variações\",\"navTitle\":\"Consistência\",\"summary\":\"Diferenciar consistência forte de consistência eventual\",\"level\":\"intermediario\",\"order\":21,\"section\":\"conceitos-centrais\",\"group\":\"Fundamentos de sistemas distribuídos\",\"file\":\"system-design/consistencia.md\"},{\"slug\":\"trade-offs\",\"categorySlug\":\"system-design\",\"title\":\"Trade-offs de Design: o Porquê por Trás de Cada Escolha\",\"navTitle\":\"Trade-offs de Design\",\"summary\":\"Internalizar que toda decisão técnica envolve um custo\",\"level\":\"intermediario\",\"order\":22,\"section\":\"conceitos-centrais\",\"group\":\"Fundamentos de sistemas distribuídos\",\"file\":\"system-design/trade-offs.md\"},{\"slug\":\"feed-noticias\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Feed de Notícias em Escala\",\"navTitle\":\"Feed de Notícias em Escala\",\"summary\":\"Aplicar o framework a um problema com relacionamentos sociais complexos (seguidores)\",\"level\":\"avancado\",\"order\":23,\"section\":\"exercicios-praticos\",\"group\":\"Mensagens e feeds\",\"file\":\"system-design/feed-noticias.md\"},{\"slug\":\"mensagens-tempo-real\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Sistema de Mensagens em Tempo Real\",\"navTitle\":\"Sistema de Mensagens em Tempo Real\",\"summary\":\"Aplicar o framework a um problema que exige comunicação em tempo real\",\"level\":\"avancado\",\"order\":24,\"section\":\"exercicios-praticos\",\"group\":\"Mensagens e feeds\",\"file\":\"system-design/mensagens-tempo-real.md\"},{\"slug\":\"editor-colaborativo\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Editor de Documentos Colaborativo (estilo Google Docs)\",\"navTitle\":\"Editor de Documentos Colaborativo\",\"summary\":\"Projete um editor de texto onde múltiplos usuários podem editar o mesmo documento simultaneamente, vendo as mudanças uns dos outros em tempo real.\",\"level\":\"avancado\",\"order\":25,\"section\":\"exercicios-praticos\",\"group\":\"Mensagens e feeds\",\"file\":\"system-design/editor-colaborativo.md\"},{\"slug\":\"tinder\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Aplicativo de Relacionamento (estilo Tinder)\",\"navTitle\":\"Aplicativo de Relacionamento\",\"summary\":\"Projete um aplicativo que mostra perfis de outros usuários próximos geograficamente, permite curtir/rejeitar, e cria uma conexão (match) quando duas pessoas se curtem mutuamente.\",\"level\":\"avancado\",\"order\":26,\"section\":\"exercicios-praticos\",\"group\":\"Mensagens e feeds\",\"file\":\"system-design/tinder.md\"},{\"slug\":\"uber\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Serviço de Transporte (estilo Uber)\",\"navTitle\":\"Serviço de Transporte\",\"summary\":\"Projete um sistema de transporte sob demanda que conecta passageiros a motoristas próximos, calcula uma rota e um preço estimado, e acompanha a corrida em tempo real.\",\"level\":\"avancado\",\"order\":27,\"section\":\"exercicios-praticos\",\"group\":\"Localização e entrega\",\"file\":\"system-design/uber.md\"},{\"slug\":\"busca-locais-proximos\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Sistema de Busca de Locais Próximos (estilo Yelp)\",\"navTitle\":\"Sistema de Busca de Locais Próximos\",\"summary\":\"Projete um sistema que permite buscar estabelecimentos (restaurantes, lojas) próximos a uma localização, filtrando por categoria e ordenando por avaliação ou distância.\",\"level\":\"avancado\",\"order\":28,\"section\":\"exercicios-praticos\",\"group\":\"Localização e entrega\",\"file\":\"system-design/busca-locais-proximos.md\"},{\"slug\":\"entrega-local\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Serviço de Entrega Local (estilo Gopuff/iFood)\",\"navTitle\":\"Serviço de Entrega Local\",\"summary\":\"Projete um serviço que conecta usuários a lojas ou restaurantes próximos, permite fazer um pedido, e acompanha a entrega até o endereço do usuário.\",\"level\":\"avancado\",\"order\":29,\"section\":\"exercicios-praticos\",\"group\":\"Localização e entrega\",\"file\":\"system-design/entrega-local.md\"},{\"slug\":\"ticketmaster\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Sistema de Venda de Ingressos (estilo Ticketmaster)\",\"navTitle\":\"Sistema de Venda de Ingressos\",\"summary\":\"Projete um sistema de venda de ingressos para eventos, onde múltiplos usuários competem por um número limitado de assentos, sem permitir venda duplicada do mesmo assento.\",\"level\":\"avancado\",\"order\":30,\"section\":\"exercicios-praticos\",\"group\":\"Transações e concorrência\",\"file\":\"system-design/ticketmaster.md\"},{\"slug\":\"leilao-online\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Sistema de Leilão Online\",\"navTitle\":\"Sistema de Leilão Online\",\"summary\":\"Projete um sistema de leilão online, onde usuários fazem lances por um item dentro de um período de tempo definido, e o maior lance ao final do prazo vence.\",\"level\":\"avancado\",\"order\":31,\"section\":\"exercicios-praticos\",\"group\":\"Transações e concorrência\",\"file\":\"system-design/leilao-online.md\"},{\"slug\":\"sistema-pagamentos\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Sistema de Pagamentos\",\"navTitle\":\"Sistema de Pagamentos\",\"summary\":\"Projete um sistema que processa pagamentos entre usuários (ou entre um usuário e um comerciante), garantindo que cada transação seja processada exatamente uma vez, mesmo diante de falhas de rede.\",\"level\":\"avancado\",\"order\":32,\"section\":\"exercicios-praticos\",\"group\":\"Transações e concorrência\",\"file\":\"system-design/sistema-pagamentos.md\"},{\"slug\":\"plataforma-negociacao-acoes\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar uma Plataforma de Negociação de Ações (estilo Robinhood)\",\"navTitle\":\"Plataforma de Negociação de Ações\",\"summary\":\"Projete uma plataforma onde usuários podem comprar e vender ações, vendo preços em tempo real e executando ordens de compra/venda.\",\"level\":\"avancado\",\"order\":33,\"section\":\"exercicios-praticos\",\"group\":\"Transações e concorrência\",\"file\":\"system-design/plataforma-negociacao-acoes.md\"},{\"slug\":\"youtube\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar uma Plataforma de Vídeo (estilo YouTube)\",\"navTitle\":\"Plataforma de Vídeo\",\"summary\":\"Projete uma plataforma de compartilhamento de vídeos, incluindo upload, processamento e reprodução em diferentes qualidades.\",\"level\":\"avancado\",\"order\":34,\"section\":\"exercicios-praticos\",\"group\":\"Dados em larga escala\",\"file\":\"system-design/youtube.md\"},{\"slug\":\"web-crawler\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Web Crawler Distribuído\",\"navTitle\":\"Web Crawler Distribuído\",\"summary\":\"Projete um sistema que navega pela web automaticamente, baixando e indexando páginas, seguindo links encontrados em cada página visitada.\",\"level\":\"avancado\",\"order\":35,\"section\":\"exercicios-praticos\",\"group\":\"Dados em larga escala\",\"file\":\"system-design/web-crawler.md\"},{\"slug\":\"agregador-cliques-anuncios\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Agregador de Cliques em Anúncios\",\"navTitle\":\"Agregador de Cliques em Anúncios\",\"summary\":\"Projete um sistema que recebe um volume altíssimo de eventos de clique em anúncios, e produz métricas agregadas (ex: cliques por anúncio, por minuto) quase em tempo real.\",\"level\":\"avancado\",\"order\":36,\"section\":\"exercicios-praticos\",\"group\":\"Dados em larga escala\",\"file\":\"system-design/agregador-cliques-anuncios.md\"},{\"slug\":\"rastreamento-atividades\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Sistema de Rastreamento de Atividades (estilo Strava)\",\"navTitle\":\"Sistema de Rastreamento de Atividades\",\"summary\":\"Projete um sistema que registra atividades físicas de usuários (corrida, ciclismo), incluindo o trajeto percorrido (uma sequência de coordenadas GPS), distância, tempo e permite comparar desempenho com outros usuários em trechos específicos.\",\"level\":\"avancado\",\"order\":37,\"section\":\"exercicios-praticos\",\"group\":\"Dados em larga escala\",\"file\":\"system-design/rastreamento-atividades.md\"},{\"slug\":\"encurtador-url\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Encurtador de URLs\",\"navTitle\":\"Encurtador de URLs\",\"summary\":\"Aplicar o framework completo a um problema clássico e relativamente contido\",\"level\":\"avancado\",\"order\":38,\"section\":\"exercicios-praticos\",\"group\":\"Infraestrutura e ferramentas\",\"file\":\"system-design/encurtador-url.md\"},{\"slug\":\"cache-distribuido\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Sistema de Cache Distribuído\",\"navTitle\":\"Sistema de Cache Distribuído\",\"summary\":\"Projete o próprio serviço de cache distribuído (não um sistema que apenas *usa* cache) — pense em como um Redis ou Memcached são construídos por dentro, capaz de escalar entre múltiplos nós.\",\"level\":\"avancado\",\"order\":39,\"section\":\"exercicios-praticos\",\"group\":\"Infraestrutura e ferramentas\",\"file\":\"system-design/cache-distribuido.md\"},{\"slug\":\"agendador-tarefas\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar um Agendador de Tarefas (Job Scheduler)\",\"navTitle\":\"Agendador de Tarefas\",\"summary\":\"Projete um sistema que permite agendar tarefas para execução em um momento futuro específico, ou de forma recorrente (ex: \\\"todo dia às 3h da manhã\\\"), garantindo que cada tarefa seja executada exatamente uma vez.\",\"level\":\"avancado\",\"order\":40,\"section\":\"exercicios-praticos\",\"group\":\"Infraestrutura e ferramentas\",\"file\":\"system-design/agendador-tarefas.md\"},{\"slug\":\"plataforma-julgamento-codigo\",\"categorySlug\":\"system-design\",\"title\":\"Exercício: Projetar uma Plataforma de Julgamento de Código (estilo LeetCode)\",\"navTitle\":\"Plataforma de Julgamento de Código\",\"summary\":\"Projete uma plataforma onde usuários submetem código para resolver problemas de programação, e o sistema executa esse código contra casos de teste, retornando se a solução passou ou falhou.\",\"level\":\"avancado\",\"order\":41,\"section\":\"exercicios-praticos\",\"group\":\"Infraestrutura e ferramentas\",\"file\":\"system-design/plataforma-julgamento-codigo.md\"},{\"slug\":\"outros-problemas\",\"categorySlug\":\"system-design\",\"title\":\"Outros Problemas Clássicos (Rate Limiter, Busca, etc.)\",\"navTitle\":\"Outros Problemas Clássicos\",\"summary\":\"Praticar o framework em problemas variados, fora dos exercícios já detalhados\",\"level\":\"avancado\",\"order\":42,\"section\":\"exercicios-praticos\",\"group\":\"Infraestrutura e ferramentas\",\"file\":\"system-design/outros-problemas.md\"},{\"slug\":\"postgresql\",\"categorySlug\":\"system-design\",\"title\":\"Deep Dive: PostgreSQL em Profundidade\",\"navTitle\":\"PostgreSQL em Profundidade\",\"summary\":\"Explicar índices B-tree e quando eles realmente ajudam (e quando não)\",\"level\":\"intermediario\",\"order\":43,\"section\":\"deep-dives-tecnologias\",\"group\":\"Bancos e busca\",\"file\":\"system-design/postgresql.md\"},{\"slug\":\"cassandra-dynamodb\",\"categorySlug\":\"system-design\",\"title\":\"Deep Dive: Cassandra e DynamoDB\",\"navTitle\":\"Cassandra e DynamoDB\",\"summary\":\"Projetar uma chave de partição e chave de clustering para um caso de uso concreto\",\"level\":\"intermediario\",\"order\":44,\"section\":\"deep-dives-tecnologias\",\"group\":\"Bancos e busca\",\"file\":\"system-design/cassandra-dynamodb.md\"},{\"slug\":\"redis\",\"categorySlug\":\"system-design\",\"title\":\"Deep Dive: Redis\",\"navTitle\":\"Redis\",\"summary\":\"Explicar por que Redis é rápido (modelo single-threaded + dados em memória) e o que isso custa\",\"level\":\"intermediario\",\"order\":45,\"section\":\"deep-dives-tecnologias\",\"group\":\"Bancos e busca\",\"file\":\"system-design/redis.md\"},{\"slug\":\"elasticsearch\",\"categorySlug\":\"system-design\",\"title\":\"Deep Dive: Elasticsearch\",\"navTitle\":\"Elasticsearch\",\"summary\":\"Explicar como um índice invertido torna a busca textual rápida, com um exemplo construído à mão\",\"level\":\"intermediario\",\"order\":46,\"section\":\"deep-dives-tecnologias\",\"group\":\"Bancos e busca\",\"file\":\"system-design/elasticsearch.md\"},{\"slug\":\"kafka\",\"categorySlug\":\"system-design\",\"title\":\"Deep Dive: Kafka\",\"navTitle\":\"Kafka\",\"summary\":\"Definir com precisão cada peça do vocabulário do Kafka: producer, broker, topic, partition, consumer, consumer group, offset\",\"level\":\"intermediario\",\"order\":47,\"section\":\"deep-dives-tecnologias\",\"group\":\"Streaming e mensageria\",\"file\":\"system-design/kafka.md\"},{\"slug\":\"flink\",\"categorySlug\":\"system-design\",\"title\":\"Deep Dive: Flink (Processamento de Streams)\",\"navTitle\":\"Flink\",\"summary\":\"Explicar janelas de tempo (tumbling, sliding, session) com exemplos numéricos concretos\",\"level\":\"intermediario\",\"order\":48,\"section\":\"deep-dives-tecnologias\",\"group\":\"Streaming e mensageria\",\"file\":\"system-design/flink.md\"},{\"slug\":\"zookeeper\",\"categorySlug\":\"system-design\",\"title\":\"Deep Dive: ZooKeeper\",\"navTitle\":\"ZooKeeper\",\"summary\":\"Explicar znodes, znodes efêmeros e sequenciais, e watches com um exemplo construído passo a passo\",\"level\":\"intermediario\",\"order\":49,\"section\":\"deep-dives-tecnologias\",\"group\":\"Coordenação e borda\",\"file\":\"system-design/zookeeper.md\"},{\"slug\":\"api-gateway\",\"categorySlug\":\"system-design\",\"title\":\"Deep Dive: API Gateway\",\"navTitle\":\"API Gateway\",\"summary\":\"Listar as responsabilidades concretas centralizadas em um API Gateway, com exemplos de cada uma\",\"level\":\"intermediario\",\"order\":50,\"section\":\"deep-dives-tecnologias\",\"group\":\"Coordenação e borda\",\"file\":\"system-design/api-gateway.md\"},{\"slug\":\"escalando-leituras\",\"categorySlug\":\"system-design\",\"title\":\"Padrão: Escalando Leituras\",\"navTitle\":\"Escalando Leituras\",\"summary\":\"Reconhecer quando um problema é, no fundo, um problema de escala de leitura\",\"level\":\"intermediario\",\"order\":51,\"section\":\"padroes-recorrentes\",\"group\":\"Escala e concorrência\",\"file\":\"system-design/escalando-leituras.md\"},{\"slug\":\"lidando-com-contencao\",\"categorySlug\":\"system-design\",\"title\":\"Padrão: Lidando com Contenção\",\"navTitle\":\"Lidando com Contenção\",\"summary\":\"Reconhecer problemas de contenção (concorrência sobre um recurso limitado)\",\"level\":\"intermediario\",\"order\":52,\"section\":\"padroes-recorrentes\",\"group\":\"Escala e concorrência\",\"file\":\"system-design/lidando-com-contencao.md\"},{\"slug\":\"proximidade\",\"categorySlug\":\"system-design\",\"title\":\"Padrão: Proximidade (Busca Geoespacial)\",\"navTitle\":\"Proximidade\",\"summary\":\"Reconhecer problemas que envolvem busca por proximidade geográfica\",\"level\":\"intermediario\",\"order\":53,\"section\":\"padroes-recorrentes\",\"group\":\"Escala e concorrência\",\"file\":\"system-design/proximidade.md\"},{\"slug\":\"atualizacoes-tempo-real\",\"categorySlug\":\"system-design\",\"title\":\"Padrão: Atualizações em Tempo Real\",\"navTitle\":\"Atualizações em Tempo Real\",\"summary\":\"Conhecer as principais técnicas para entregar atualizações em tempo real a um cliente\",\"level\":\"intermediario\",\"order\":54,\"section\":\"padroes-recorrentes\",\"group\":\"Tempo real e arquivos\",\"file\":\"system-design/atualizacoes-tempo-real.md\"},{\"slug\":\"blobs-grandes\",\"categorySlug\":\"system-design\",\"title\":\"Padrão: Blobs Grandes (Arquivos)\",\"navTitle\":\"Blobs Grandes\",\"summary\":\"Reconhecer quando um sistema precisa lidar com arquivos grandes de forma diferente de dados estruturados comuns\",\"level\":\"intermediario\",\"order\":55,\"section\":\"padroes-recorrentes\",\"group\":\"Tempo real e arquivos\",\"file\":\"system-design/blobs-grandes.md\"},{\"slug\":\"tarefas-longa-duracao\",\"categorySlug\":\"system-design\",\"title\":\"Padrão: Tarefas de Longa Duração\",\"navTitle\":\"Tarefas de Longa Duração\",\"summary\":\"Reconhecer quando uma operação não deve ser tratada de forma síncrona\",\"level\":\"intermediario\",\"order\":56,\"section\":\"padroes-recorrentes\",\"group\":\"Fluxos longos\",\"file\":\"system-design/tarefas-longa-duracao.md\"},{\"slug\":\"processos-multi-etapas\",\"categorySlug\":\"system-design\",\"title\":\"Padrão: Processos de Múltiplas Etapas\",\"navTitle\":\"Processos de Múltiplas Etapas\",\"summary\":\"Reconhecer quando um fluxo de negócio envolve múltiplas etapas coordenadas entre diferentes serviços\",\"level\":\"intermediario\",\"order\":57,\"section\":\"padroes-recorrentes\",\"group\":\"Fluxos longos\",\"file\":\"system-design/processos-multi-etapas.md\"}]");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/content/categories.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "system-design",
        "slug": "system-design",
        "name": "System Design",
        "description": "Framework de entrevista, conceitos centrais, tecnologias-chave, deep dives e exercícios práticos.",
        "icon": "Network",
        "order": 1,
        "navGroup": "learn-primary",
        "hasQuiz": true,
        "sections": [
            {
                "id": "framework-entrega",
                "name": "Framework de Entrega",
                "order": 1
            },
            {
                "id": "tecnologias-chave",
                "name": "Tecnologias-Chave",
                "order": 2
            },
            {
                "id": "conceitos-centrais",
                "name": "Conceitos Centrais",
                "order": 3
            },
            {
                "id": "deep-dives-tecnologias",
                "name": "Deep Dives",
                "order": 4
            },
            {
                "id": "padroes-recorrentes",
                "name": "Padrões Recorrentes",
                "order": 5
            },
            {
                "id": "exercicios-praticos",
                "name": "Exercícios Práticos",
                "order": 6
            }
        ]
    },
    {
        "id": "code",
        "slug": "code",
        "name": "Code",
        "description": "Fundamentos de entrevista de código, padrões essenciais de DSA e prática por padrão.",
        "icon": "Code2",
        "order": 2,
        "navGroup": "learn-primary",
        "hasQuiz": true,
        "sections": [
            {
                "id": "fundamentals",
                "name": "Fundamentos",
                "order": 1
            },
            {
                "id": "two-pointers",
                "name": "Two Pointers",
                "order": 2
            },
            {
                "id": "dfs",
                "name": "Depth First Search",
                "order": 3
            },
            {
                "id": "bfs",
                "name": "Breadth First Search",
                "order": 4
            },
            {
                "id": "patterns",
                "name": "Outros Padrões",
                "order": 6
            },
            {
                "id": "pattern-recognition",
                "name": "Reconhecendo o padrão",
                "order": 7
            },
            {
                "id": "practice",
                "name": "Prática",
                "order": 8
            }
        ]
    },
    {
        "id": "low-level-design",
        "slug": "low-level-design",
        "name": "Low Level Design",
        "description": "Clean Code, SOLID e os padrões de projeto do GoF mais cobrados em entrevista — com exemplos em Java.",
        "icon": "Boxes",
        "order": 3,
        "navGroup": "learn-primary",
        "sections": [
            {
                "id": "fundamentos",
                "name": "Fundamentos",
                "order": 1
            },
            {
                "id": "clean-code",
                "name": "Clean Code",
                "order": 2
            },
            {
                "id": "solid",
                "name": "SOLID",
                "order": 3
            },
            {
                "id": "padroes-criacionais",
                "name": "Padrões Criacionais",
                "order": 4
            },
            {
                "id": "padroes-estruturais",
                "name": "Padrões Estruturais",
                "order": 5
            },
            {
                "id": "padroes-comportamentais",
                "name": "Padrões Comportamentais",
                "order": 6
            },
            {
                "id": "sintese",
                "name": "Síntese",
                "order": 7
            }
        ]
    },
    {
        "id": "behavioral",
        "slug": "behavioral",
        "name": "Behavioral",
        "description": "Framework SARL, catálogo de histórias e categorias clássicas de perguntas comportamentais.",
        "icon": "MessageSquare",
        "order": 4,
        "navGroup": "learn-primary",
        "hasQuiz": true,
        "sections": [
            {
                "id": "fundamentals",
                "name": "Fundamentos",
                "order": 1
            },
            {
                "id": "story-catalog",
                "name": "Catálogo de histórias",
                "order": 2
            },
            {
                "id": "question-categories",
                "name": "Categorias de perguntas",
                "order": 3
            },
            {
                "id": "practice",
                "name": "Prática",
                "order": 4
            },
            {
                "id": "advanced-topics",
                "name": "Tópicos avançados",
                "order": 5
            }
        ]
    },
    {
        "id": "ai-coding",
        "slug": "ai-coding",
        "name": "AI Coding",
        "description": "Como conduzir entrevistas de coding com IA: prompting, fluxo de trabalho e armadilhas.",
        "icon": "Sparkles",
        "order": 5,
        "navGroup": "learn-primary",
        "badge": "New",
        "hasQuiz": true,
        "sections": [
            {
                "id": "fundamentals",
                "name": "Fundamentos",
                "order": 1
            },
            {
                "id": "workflow",
                "name": "Fluxo de trabalho",
                "order": 2
            },
            {
                "id": "pitfalls",
                "name": "Armadilhas",
                "order": 3
            },
            {
                "id": "practice",
                "name": "Prática",
                "order": 4
            }
        ]
    },
    {
        "id": "ml-system-design",
        "slug": "ml-system-design",
        "name": "ML System Design",
        "description": "Framework de entrega para ML, conceitos centrais e estudos de caso guiados.",
        "icon": "Brain",
        "order": 6,
        "navGroup": "learn-primary",
        "hasQuiz": true,
        "sections": [
            {
                "id": "framework",
                "name": "Framework",
                "order": 1
            },
            {
                "id": "core-concepts",
                "name": "Core Concepts",
                "order": 2
            },
            {
                "id": "question-breakdowns",
                "name": "Question Breakdowns",
                "order": 3
            }
        ]
    },
    {
        "id": "salary-negotiation",
        "slug": "salary-negotiation",
        "name": "Negociação salarial",
        "description": "Em breve.",
        "icon": "Workflow",
        "order": 7,
        "navGroup": "learn-secondary",
        "stub": true
    },
    {
        "id": "interview-guides",
        "slug": "interview-guides",
        "name": "Guias de entrevista",
        "description": "Em breve.",
        "icon": "BookOpen",
        "order": 8,
        "navGroup": "learn-secondary",
        "stub": true
    },
    {
        "id": "blog",
        "slug": "blog",
        "name": "Blog",
        "description": "Em breve.",
        "icon": "Newspaper",
        "order": 9,
        "navGroup": "learn-secondary",
        "stub": true
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/dev.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Só vale em `next dev`. O build de produção da Vercel nunca liga isto. */ __turbopack_context__.s([
    "isDevBypass",
    ()=>isDevBypass
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
function isDevBypass() {
    return ("TURBOPACK compile-time value", "development") === "development";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/nav.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getLearnCategories",
    ()=>getLearnCategories,
    "getNavSections",
    ()=>getNavSections,
    "getPrimaryLearnCategories",
    ()=>getPrimaryLearnCategories,
    "getQuizCategories",
    ()=>getQuizCategories
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$categories$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/content/categories.json.[json].cjs [app-client] (ecmascript)");
;
const CATEGORIES = __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$categories$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
function getLearnCategories() {
    return CATEGORIES.filter((c)=>c.navGroup === "learn-primary" || c.navGroup === "learn-secondary").sort((a, b)=>a.order - b.order);
}
function getPrimaryLearnCategories() {
    return CATEGORIES.filter((c)=>c.navGroup === "learn-primary").sort((a, b)=>a.order - b.order);
}
function getQuizCategories() {
    return CATEGORIES.filter((c)=>c.hasQuiz && !c.stub).sort((a, b)=>a.order - b.order);
}
function getNavSections() {
    const primary = CATEGORIES.filter((c)=>c.navGroup === "learn-primary").sort((a, b)=>a.order - b.order);
    const secondary = CATEGORIES.filter((c)=>c.navGroup === "learn-secondary").sort((a, b)=>a.order - b.order);
    const learnLinks = [
        ...primary.map((c)=>({
                label: c.name,
                href: `/category/${c.slug}`,
                badge: c.badge
            })),
        ...secondary.map((c, i)=>({
                label: c.name,
                href: `/category/${c.slug}`,
                badge: c.badge,
                dividerBefore: i === 0
            }))
    ];
    const practiceLinks = [
        ...getQuizCategories().map((c)=>({
                label: `Avaliação · ${c.name}`,
                href: `/category/${c.slug}/quiz`
            })),
        {
            label: "Meu progresso",
            href: "/progress"
        }
    ];
    const communityLinks = [
        {
            label: "Perguntas e discussão",
            href: "/community"
        },
        {
            label: "Discord (em breve)",
            href: "/community#discord"
        }
    ];
    return [
        {
            id: "learn",
            label: "Aprender",
            href: "/learn",
            links: learnLinks
        },
        {
            id: "practice",
            label: "Praticar",
            href: "/practice",
            links: practiceLinks
        },
        {
            id: "community",
            label: "Comunidade",
            href: "/community",
            links: communityLinks
        }
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/paths.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Browser-safe path helpers (no Node fs). */ __turbopack_context__.s([
    "articleHref",
    ()=>articleHref,
    "categoryHref",
    ()=>categoryHref
]);
function articleHref(a) {
    return `/category/${a.categorySlug}/${a.slug}`;
}
function categoryHref(slug) {
    return `/category/${slug}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/progress.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categoryQuizPct",
    ()=>categoryQuizPct,
    "clearProgressCache",
    ()=>clearProgressCache,
    "emptyProgress",
    ()=>emptyProgress,
    "flushProgress",
    ()=>flushProgress,
    "getCategoryReadiness",
    ()=>getCategoryReadiness,
    "getOverallStats",
    ()=>getOverallStats,
    "hydrateLocalDev",
    ()=>hydrateLocalDev,
    "hydrateProgressFromServer",
    ()=>hydrateProgressFromServer,
    "isArticleVisited",
    ()=>isArticleVisited,
    "isProgressHydrated",
    ()=>isProgressHydrated,
    "loadProgress",
    ()=>loadProgress,
    "markArticleRead",
    ()=>markArticleRead,
    "markCategoryQuiz",
    ()=>markCategoryQuiz,
    "saveProgress",
    ()=>saveProgress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$categories$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/content/categories.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$articles$2f$index$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/content/articles/index.json.[json].cjs [app-client] (ecmascript)");
;
;
;
const CATEGORIES = __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$categories$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
const ARTICLES = __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$articles$2f$index$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
let cache = emptyProgress();
let userId = null;
let hydrated = false;
let persistTimer;
function emptyProgress() {
    return {
        visited: [],
        quiz: {},
        gates: {},
        sessions: {},
        simulador: {}
    };
}
function isProgressHydrated() {
    return hydrated;
}
function emit() {
    if ("TURBOPACK compile-time truthy", 1) {
        window.dispatchEvent(new Event("trilhas-progress"));
    }
}
function rowToState(row) {
    if (!row) return emptyProgress();
    return {
        visited: Array.isArray(row.visited) ? row.visited : [],
        lastPath: row.last_path ?? undefined,
        quiz: row.quiz && typeof row.quiz === "object" ? row.quiz : {},
        gates: row.gates && typeof row.gates === "object" ? row.gates : {},
        sessions: row.sessions && typeof row.sessions === "object" ? row.sessions : {},
        simulador: row.simulador && typeof row.simulador === "object" ? row.simulador : {}
    };
}
async function flush() {
    if (!userId || !hydrated) return;
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from("user_progress").upsert({
        user_id: userId,
        visited: cache.visited,
        last_path: cache.lastPath ?? null,
        gates: cache.gates ?? {},
        quiz: cache.quiz ?? {},
        sessions: cache.sessions ?? {},
        simulador: cache.simulador ?? {},
        updated_at: new Date().toISOString()
    }, {
        onConflict: "user_id"
    });
    if (error) console.error("Falha ao gravar progresso", error.message);
}
function persistSoon() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    clearTimeout(persistTimer);
    persistTimer = setTimeout(()=>{
        void flush();
    }, 400);
}
function loadProgress() {
    return cache;
}
function saveProgress(state) {
    cache = state;
    emit();
    persistSoon();
}
async function hydrateProgressFromServer(uid, row) {
    userId = uid;
    cache = rowToState(row);
    hydrated = true;
    emit();
}
function hydrateLocalDev() {
    userId = null;
    cache = emptyProgress();
    hydrated = true;
    emit();
}
function clearProgressCache() {
    cache = emptyProgress();
    userId = null;
    hydrated = false;
    emit();
}
async function flushProgress() {
    clearTimeout(persistTimer);
    await flush();
}
function markArticleRead(path, _categorySlug, _articleSlug) {
    if (!hydrated) return;
    const state = loadProgress();
    if (!state.visited.includes(path)) state.visited.push(path);
    state.lastPath = path;
    saveProgress(state);
}
function markCategoryQuiz(categorySlug, score, total) {
    if (!hydrated) return;
    const state = loadProgress();
    const pct = total > 0 ? Math.round(score / total * 100) : 0;
    state.quiz = {
        ...state.quiz || {},
        [`vm:${categorySlug}`]: pct
    };
    saveProgress(state);
}
function categoryQuizPct(categorySlug) {
    const state = loadProgress();
    const v = state.quiz?.[`vm:${categorySlug}`];
    return typeof v === "number" ? v : 0;
}
function articlePath(a) {
    return `/category/${a.categorySlug}/${a.slug}`;
}
function isArticleVisited(path) {
    const state = loadProgress();
    return (state.visited || []).includes(path);
}
function getCategoryReadiness() {
    const state = loadProgress();
    const visited = new Set(state.visited || []);
    return [
        ...CATEGORIES
    ].filter((c)=>!c.stub).sort((a, b)=>a.order - b.order).map((c)=>{
        const arts = ARTICLES.filter((a)=>a.categorySlug === c.slug).sort((a, b)=>a.order - b.order);
        const m = categoryMastery(c.slug, visited);
        return {
            slug: c.slug,
            name: c.name,
            description: c.description,
            href: `/category/${c.slug}`,
            pct: m.pct,
            done: m.done,
            total: m.total,
            quizPct: categoryQuizPct(c.slug),
            articles: arts.map((a)=>({
                    slug: a.slug,
                    title: a.title,
                    href: articlePath(a),
                    done: visited.has(articlePath(a))
                }))
        };
    });
}
function categoryMastery(categorySlug, visited) {
    const arts = ARTICLES.filter((a)=>a.categorySlug === categorySlug);
    const total = Math.max(arts.length, 1);
    const done = arts.filter((a)=>visited.has(articlePath(a))).length;
    const readPct = Math.round(done / total * 100);
    const quizPct = categoryQuizPct(categorySlug);
    const pct = quizPct > 0 ? Math.round(readPct * 0.7 + quizPct * 0.3) : readPct;
    return {
        done,
        total: arts.length,
        pct
    };
}
function getOverallStats() {
    const state = loadProgress();
    const visited = new Set(state.visited || []);
    const categories = [
        ...CATEGORIES
    ].filter((c)=>!c.stub).sort((a, b)=>a.order - b.order).map((c)=>{
        const m = categoryMastery(c.slug, visited);
        return {
            slug: c.slug,
            name: c.name,
            description: c.description,
            href: `/category/${c.slug}`,
            articleCount: m.total,
            done: m.done,
            total: m.total,
            pct: m.pct
        };
    });
    const radarData = categories.map((c)=>({
            category: c.name.split(" ")[0] || c.name,
            score: c.pct
        }));
    const avgMastery = categories.length === 0 ? 0 : Math.round(categories.reduce((acc, c)=>acc + c.pct, 0) / categories.length);
    const vmKeys = Object.entries(state.quiz || {}).filter(([k])=>k.startsWith("vm:"));
    const questionsAnswered = vmKeys.length * 5;
    const questionsMastered = Math.round(vmKeys.reduce((acc, [, pct])=>acc + pct / 100 * 5, 0));
    const firstUnread = ARTICLES.map(articlePath).find((p)=>!visited.has(p)) || "/category/system-design/orientacao";
    return {
        questionsAnswered,
        questionsMastered,
        sessionsCompleted: Object.values(state.sessions || {}).reduce((acc, arr)=>acc + (Array.isArray(arr) ? arr.filter(Boolean).length : 0), 0),
        avgMastery,
        lastPath: state.lastPath,
        firstPending: firstUnread,
        categoriesCount: categories.length,
        articlesCount: ARTICLES.length,
        radarData,
        categories
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/supabase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
function createClient() {
    const url = ("TURBOPACK compile-time value", "https://xxxuqxmruoolmtqozcjf.supabase.co");
    const key = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHVxeG1ydW9vbG10cW96Y2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwOTYzNTcsImV4cCI6MjEwNDY3MjM1N30.ufk9_L9v9EaDcACx60Xy08b-7BwazW-tO2JpdGGsYA8");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(url, key);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/units.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "groupByUnit",
    ()=>groupByUnit
]);
function groupByUnit(items) {
    const units = [];
    for (const a of items){
        const last = units[units.length - 1];
        if (last && last.name === a.group) last.items.push(a);
        else units.push({
            name: a.group,
            items: [
                a
            ]
        });
    }
    return units;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/use-visited.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useVisited",
    ()=>useVisited
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$progress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/progress.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useVisited() {
    _s();
    const [visited, setVisited] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useVisited.useEffect": ()=>{
            const sync = {
                "useVisited.useEffect.sync": ()=>setVisited(new Set((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$progress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadProgress"])().visited || []))
            }["useVisited.useEffect.sync"];
            sync();
            window.addEventListener("trilhas-progress", sync);
            return ({
                "useVisited.useEffect": ()=>window.removeEventListener("trilhas-progress", sync)
            })["useVisited.useEffect"];
        }
    }["useVisited.useEffect"], []);
    return visited;
}
_s(useVisited, "5Nu39/k2RutisCa6ckY9JDVVUIU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1wcha60._.js.map