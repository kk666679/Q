// Unified AI Components SDK
// This index file re-exports all components from:
// 1. sdk/components/ai/ submodules (AI-enhanced components)
// 2. components/ai-elements/ (AI-specific elements)
// 3. components/ui/ (base UI components)

// ============================================
// Re-export from sdk/components/ai/ submodules
// ============================================

// AI Metric Card & Related
export { AIMetricCard } from "./aimetric-card";
export { AIInsightCard } from "./aiinsight-card";
export { AIActionCard } from "./aiaction-card";
export { AIStatistic } from "./aistatistic";

export { AILiveBadge } from "./ailive-badge";
export { AIComplianceCard } from "./aicompliance-card";
export { AIProgressCard } from "./aiprogress-card";
export { AIAlert } from "./aialert";
export { AISearchBar } from "./aisearch-bar";
export { AIChip } from "./aichip";
export { AIDataTable } from "./aidata-table";
// export { AITable } from "./aitable"; // Commented out - file missing
export { AIToggle } from "./aitoggle";
export { AIBadge } from "./aibadge";
export { AITooltip } from "./aitooltip";
export { AILoadingState } from "./ailoading-state";
export { AIErrorState } from "./aierror-state";
export { AIStatusIndicator } from "./aistatus-indicator";

// Analysis & Chat Components
export { AIAnalysisCard } from "./analysis-card";
export { AIChatInterface } from "./chat-interface";
export { AIRecommendationPanel, AIQuickActions } from "./recommendation-panel";
export { AIProcessTimeline, AIAuditTimeline } from "./process-timeline";
export { AIRiskAssessmentCard, AIRiskSummary } from "./risk-assessment-card";
export { AIDocumentAnnotation } from "./document-annotation";
export { AIVersionCompare } from "./version-compare";


// Form & Data Components
export { AIFormGenerator } from "./aiform-generator";
export { AIChartContainer } from "./aichart-container";
export { AIChatAssistant } from "./aichat-assistant";
export { AIFeaturesCard } from "./aifeatures-card";
export { AINotification } from "./ainotification";
export { AIDataPoint } from "./aidata-point";

// Additional Components
export { DocumentBuilder } from "../document-builder";
export { ComplianceChecker } from "../compliance-checker";
export { MSStandardsViewer } from "../ms-standards-viewer";

// ============================================
// Re-export from components/ai-elements/
// ============================================

// Core AI Elements
export { Agent, AgentHeader, AgentContent, AgentInstructions, AgentTools, AgentTool, AgentOutput } from "@/components/ai-elements/agent";
export { Artifact } from "@/components/ai-elements/artifact";
export { Attachments, Attachment, AttachmentPreview, AttachmentInfo, AttachmentRemove, AttachmentHoverCard, AttachmentEmpty } from "@/components/ai-elements/attachments";
export { AudioPlayer, AudioPlayerElement, AudioPlayerControlBar, AudioPlayerPlayButton, AudioPlayerSeekBackwardButton, AudioPlayerSeekForwardButton, AudioPlayerTimeDisplay, AudioPlayerTimeRange, AudioPlayerDurationDisplay, AudioPlayerMuteButton, AudioPlayerVolumeRange } from "@/components/ai-elements/audio-player";
export { Canvas } from "@/components/ai-elements/canvas";
export { ChainOfThought, ChainOfThoughtImage, ChainOfThoughtContent } from "@/components/ai-elements/chain-of-thought";
export { Checkpoint } from "@/components/ai-elements/checkpoint";
export { CodeBlock, CodeBlockContainer, CodeBlockHeader, CodeBlockTitle, CodeBlockFilename, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockLanguageSelector, CodeBlockLanguageSelectorTrigger, CodeBlockLanguageSelectorValue, CodeBlockLanguageSelectorContent, CodeBlockLanguageSelectorItem } from "@/components/ai-elements/code-block";
export { Commit } from "@/components/ai-elements/commit";
export { Confirmation, ConfirmationTitle, ConfirmationRequest, ConfirmationAccepted, ConfirmationRejected, ConfirmationActions, ConfirmationAction } from "@/components/ai-elements/confirmation";
export { Connection } from "@/components/ai-elements/connection";
export { Context } from "@/components/ai-elements/context";
export { Controls } from "@/components/ai-elements/controls";
export { Conversation } from "@/components/ai-elements/conversation";
export { Edge } from "@/components/ai-elements/edge";
export { EnvironmentVariables } from "@/components/ai-elements/environment-variables";
export { FileTree, FileTreeFolder, FileTreeFile, FileTreeIcon, FileTreeName, FileTreeActions } from "@/components/ai-elements/file-tree";
export { Image } from "@/components/ai-elements/image";
export { InlineCitation } from "@/components/ai-elements/inline-citation";
export { JSXPreview } from "@/components/ai-elements/jsx-preview";
export { Message, MessageContent, MessageActions, MessageAction, MessageBranch, MessageBranchContent, MessageBranchSelector, MessageBranchPrevious, MessageBranchNext, MessageBranchPage, MessageResponse, MessageToolbar } from "@/components/ai-elements/message";
export { MicSelector, MicSelectorTrigger, MicSelectorContent, MicSelectorList, MicSelectorEmpty, MicSelectorItem, MicSelectorLabel, MicSelectorValue } from "@/components/ai-elements/mic-selector";
export { ModelSelector, ModelSelectorTrigger, ModelSelectorContent, ModelSelectorDialog, ModelSelectorInput, ModelSelectorList, ModelSelectorEmpty, ModelSelectorGroup, ModelSelectorItem, ModelSelectorShortcut, ModelSelectorSeparator, ModelSelectorLogo, ModelSelectorLogoGroup, ModelSelectorName } from "@/components/ai-elements/model-selector";
export { Node } from "@/components/ai-elements/node";
export { OpenIn, OpenInContent, OpenInItem, OpenInLabel, OpenInSeparator, OpenInTrigger, OpenInChatGPT, OpenInClaude, OpenInT3, OpenInScira, OpenInv0, OpenInCursor } from "@/components/ai-elements/open-in-chat";
export { PackageInfo, PackageInfoHeader, PackageInfoName, PackageInfoChangeType, PackageInfoVersion, PackageInfoDescription, PackageInfoContent, PackageInfoDependencies, PackageInfoDependency } from "@/components/ai-elements/package-info";
export { Panel } from "@/components/ai-elements/panel";
export { Persona } from "@/components/ai-elements/persona";
export { Plan } from "@/components/ai-elements/plan";
export { PromptInput, PromptInputBody, PromptInputTextarea, PromptInputHeader, PromptInputFooter, PromptInputTools, PromptInputButton, PromptInputActionMenu, PromptInputActionMenuTrigger, PromptInputActionMenuContent, PromptInputActionMenuItem, PromptInputSubmit, PromptInputSelect, PromptInputSelectTrigger, PromptInputSelectContent, PromptInputSelectItem, PromptInputSelectValue, PromptInputHoverCard, PromptInputHoverCardTrigger, PromptInputHoverCardContent, PromptInputTabsList, PromptInputTab, PromptInputTabLabel, PromptInputTabBody, PromptInputTabItem, PromptInputCommand, PromptInputCommandInput, PromptInputCommandList, PromptInputCommandEmpty, PromptInputCommandGroup, PromptInputCommandItem, PromptInputCommandSeparator } from "@/components/ai-elements/prompt-input";
export { Queue, QueueItem, QueueItemIndicator, QueueItemContent, QueueItemDescription, QueueItemActions, QueueItemAction, QueueItemAttachment, QueueItemImage, QueueItemFile, QueueList, QueueSection, QueueSectionTrigger, QueueSectionLabel, QueueSectionContent } from "@/components/ai-elements/queue";
export { useReasoning, Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
export { Sandbox, SandboxHeader, SandboxContent, SandboxTabs, SandboxTabsBar, SandboxTabsList, SandboxTabsTrigger, SandboxTabContent } from "@/components/ai-elements/sandbox";
export { SchemaDisplay, SchemaDisplayHeader, SchemaDisplayMethod, SchemaDisplayPath, SchemaDisplayDescription, SchemaDisplayContent, SchemaDisplayParameters, SchemaDisplayParameter, SchemaDisplayRequest, SchemaDisplayResponse, SchemaDisplayBody, SchemaDisplayProperty, SchemaDisplayExample } from "@/components/ai-elements/schema-display";
export { Shimmer } from "@/components/ai-elements/shimmer";
export { Snippet, SnippetAddon, SnippetText, SnippetInput, SnippetCopyButton } from "@/components/ai-elements/snippet";
export { Sources, SourcesTrigger, SourcesContent, Source } from "@/components/ai-elements/sources";
export { SpeechInput } from "@/components/ai-elements/speech-input";
export { StackTrace, StackTraceHeader, StackTraceError, StackTraceErrorType, StackTraceErrorMessage, StackTraceActions, StackTraceCopyButton, StackTraceExpandButton, StackTraceContent, StackTraceFrames } from "@/components/ai-elements/stack-trace";
export { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
export { Task, TaskItem, TaskTrigger, TaskContent } from "@/components/ai-elements/task";
export { Terminal, TerminalHeader, TerminalTitle, TerminalStatus, TerminalActions, TerminalCopyButton, TerminalClearButton, TerminalContent } from "@/components/ai-elements/terminal";
export { TestResults, TestResultsHeader, TestResultsSummary, TestResultsDuration, TestResultsProgress, TestResultsContent, TestSuite, TestSuiteName, TestSuiteStats, TestSuiteContent, Test, TestStatus, TestName, TestDuration, TestError, TestErrorMessage, TestErrorStack } from "@/components/ai-elements/test-results";
export { Tool } from "@/components/ai-elements/tool";
export { Toolbar } from "@/components/ai-elements/toolbar";
export { Transcription, TranscriptionSegment } from "@/components/ai-elements/transcription";
export { VoiceSelector, VoiceSelectorTrigger, VoiceSelectorContent, VoiceSelectorDialog, VoiceSelectorInput, VoiceSelectorList, VoiceSelectorEmpty, VoiceSelectorGroup, VoiceSelectorItem, VoiceSelectorShortcut, VoiceSelectorSeparator, VoiceSelectorGender, VoiceSelectorAccent, VoiceSelectorAge, VoiceSelectorName, VoiceSelectorDescription, VoiceSelectorAttributes, VoiceSelectorBullet, VoiceSelectorPreview, useVoiceSelector } from "@/components/ai-elements/voice-selector";
export { WebPreview, WebPreviewNavigation, WebPreviewNavigationButton, WebPreviewUrl, WebPreviewBody, WebPreviewConsole } from "@/components/ai-elements/web-preview";

// ============================================
// Re-export from components/ui/
// ============================================

// Layout
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
export { AspectRatio } from "@/components/ui/aspect-ratio";
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
export { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
export { ScrollArea } from "@/components/ui/scroll-area";
export { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
export { Skeleton } from "@/components/ui/skeleton";

// Forms
export { Button, buttonVariants } from "@/components/ui/button";
export { Input } from "@/components/ui/input";
export { Textarea } from "@/components/ui/textarea";
export { Label } from "@/components/ui/label";
export { Checkbox } from "@/components/ui/checkbox";
export { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
export { Switch } from "@/components/ui/switch";
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
export { Field } from "@/components/ui/field";
export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea } from "@/components/ui/input-group";
export { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
export { Toggle } from "@/components/ui/toggle";
export { Calendar } from "@/components/ui/calendar";

// Feedback
export { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
export { Toast, ToastProvider, ToastTitle, ToastDescription, ToastClose, ToastViewport } from "@/components/ui/toast";
export { Toaster } from "@/components/ui/toaster";
export { Progress } from "@/components/ui/progress";
export { Spinner } from "@/components/ui/spinner";
export { Toaster as Sonner } from "@/components/ui/sonner";

// Navigation
export { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
export { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
export { Pagination, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
export { Menubar, MenubarContent, MenubarItem, MenubarPortal, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar";

// Overlays
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
export { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
export { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
export { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "@/components/ui/context-menu";
export { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";

// Data Display
export { Badge, badgeVariants } from "@/components/ui/badge";
export { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
export { Kbd } from "@/components/ui/kbd";
export { Separator } from "@/components/ui/separator";
export { Item, ItemMedia, ItemContent, ItemActions, ItemGroup, ItemSeparator, ItemTitle, ItemDescription, ItemHeader, ItemFooter } from "@/components/ui/item";
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
export { Empty } from "@/components/ui/empty";

// Carousel
export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Chart
export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle } from "@/components/ui/chart";

// Slider
export { Slider } from "@/components/ui/slider";

// Button Group
export { ButtonGroup } from "@/components/ui/button-group";


// Utilities
export { useIsMobile } from "@/components/ui/use-mobile";
export { useToast } from "@/components/ui/use-toast";


export { AIExecutiveCockpitFullset, AIWorkflowOpsFullset } from "@/sdk/components/ai/fullsets";
