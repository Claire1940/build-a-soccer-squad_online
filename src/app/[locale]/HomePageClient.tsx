"use client";

import { Suspense, lazy } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calculator,
  Check,
  Clock,
  Coins,
  Crown,
  ExternalLink,
  Gem,
  Gift,
  GraduationCap,
  MessageCircle,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

// ---- Section header helper (eyebrow + title + subtitle + intro) ----
function SectionHeader({
  eyebrow,
  title,
  subtitle,
  intro,
  icon: Icon,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  intro?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      {eyebrow && (
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 md:mb-5
                      bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
        >
          {Icon && (
            <Icon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
          )}
          <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
          {subtitle}
        </p>
      )}
      {intro && (
        <p className="text-sm md:text-base text-muted-foreground/80 max-w-3xl mx-auto">
          {intro}
        </p>
      )}
    </div>
  );
}

// ---- Code status badge styling ----
function getCodeStatus(status: string): {
  className: string;
  Icon: LucideIcon;
} {
  switch (status) {
    case "available":
      return {
        className:
          "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]",
        Icon: Check,
      };
    case "upcoming":
      return {
        className:
          "bg-amber-500/10 border-amber-500/30 text-amber-400",
        Icon: Clock,
      };
    case "paid":
      return {
        className:
          "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
        Icon: Crown,
      };
    case "empty":
    default:
      return {
        className: "bg-white/5 border-border text-muted-foreground",
        Icon: X,
      };
  }
}

// ---- Tier badge styling ----
function getTierStyle(tier: string): string {
  switch (tier) {
    case "S":
      return "bg-yellow-500/15 border-yellow-500/40 text-yellow-400";
    case "A":
      return "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]";
    case "B":
      return "bg-amber-500/10 border-amber-500/30 text-amber-400";
    case "C":
    default:
      return "bg-white/5 border-border text-muted-foreground";
  }
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.build-a-soccer-squad.online";

  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Build A Soccer Squad Wiki",
        description:
          "Complete Build A Soccer Squad Wiki covering codes, tier list, players, captains, Cup Mode, chemistry, shop, rerolls, and beginner tips for the Roblox soccer squad builder.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Build A Soccer Squad - Roblox Soccer Squad Builder",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Build A Soccer Squad Wiki",
        alternateName: "Build A Soccer Squad",
        url: siteUrl,
        description:
          "Complete Build A Soccer Squad Wiki resource hub for codes, tier list, players, captains, Cup Mode, chemistry, and shop guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Build A Soccer Squad Wiki - Roblox Soccer Squad Builder",
        },
        sameAs: [
          "https://www.roblox.com/games/82524183928567/Build-A-Soccer-Squad",
          "https://www.roblox.com/communities/365587858",
          "https://www.youtube.com/watch?v=psXhyY8dk6A",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Build A Soccer Squad",
        gamePlatform: ["Roblox", "PC", "Mac", "Mobile"],
        applicationCategory: "Game",
        genre: ["Sports", "Soccer", "Card Collection", "Simulation"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 10000,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/82524183928567/Build-A-Soccer-Squad",
        },
      },
      {
        "@type": "VideoObject",
        name: "THE COMPLETE BEGINNERS GUIDE TO BUILD A SOCCER SQUAD",
        description:
          "Complete beginner guide to Build A Soccer Squad on Roblox — tips, tricks, best players, and how to build a high-rated soccer team.",
        uploadDate: "2026-06-30",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/psXhyY8dk6A",
        url: "https://www.youtube.com/watch?v=psXhyY8dk6A",
      },
    ],
  };

  // Tools Grid cards ↔ section anchor mapping (8 cards ↔ 8 sections, 1:1)
  const sectionIds = [
    "codes",
    "beginner-guide",
    "tier-list",
    "cup-mode-guide",
    "squad-rating-calculator",
    "captains-guide",
    "prime-players-guide",
    "rerolls-refreshes-rewards",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                          bg-[hsl(var(--nav-theme)/0.1)]
                          border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/82524183928567/Build-A-Soccer-Squad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* ===== Video Section (紧跟 Hero 之后) ===== */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="psXhyY8dk6A"
              title="THE COMPLETE BEGINNERS GUIDE TO BUILD A SOCCER SQUAD"
            />
          </div>
        </div>
      </section>

      {/* ===== Tools Grid - 8 Navigation Cards (模块导航区，位于视频区之后、Latest Updates 之前) ===== */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = sectionIds[index];
              return (
                <a
                  key={index}
                  href={`#${sectionId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(sectionId);
                  }}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] block"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                bg-[hsl(var(--nav-theme)/0.1)]
                                flex items-center justify-center
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ===== Latest Updates Section (Latest Updates 模块保留) ===== */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* ===== Module 1: Codes ===== */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.soccerCodes.eyebrow}
            title={t.modules.soccerCodes.title}
            subtitle={t.modules.soccerCodes.subtitle}
            intro={t.modules.soccerCodes.intro}
            icon={Gift}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.soccerCodes.items.map((item: any, index: number) => {
              const status = getCodeStatus(item.status);
              const StatusIcon = status.Icon;
              return (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl
                             hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="font-semibold text-base md:text-lg">
                      {item.label}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${status.className}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm md:text-base font-medium text-[hsl(var(--nav-theme-light))] mb-2">
                    {item.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.details}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* ===== Module 2: Beginner Guide ===== */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.beginnerGuide.eyebrow}
            title={t.modules.beginnerGuide.title}
            subtitle={t.modules.beginnerGuide.subtitle}
            intro={t.modules.beginnerGuide.intro}
            icon={GraduationCap}
          />

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.beginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl
                           hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center
                                rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5 md:mb-2">
                    <h3 className="text-lg md:text-xl font-bold">{step.title}</h3>
                    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full
                                     bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                                     text-[hsl(var(--nav-theme-light))] self-start">
                      <Check className="w-3.5 h-3.5" />
                      {step.goal}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Module 3: Tier List ===== */}
      <section id="tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.tierList.eyebrow}
            title={t.modules.tierList.title}
            subtitle={t.modules.tierList.subtitle}
            intro={t.modules.tierList.intro}
            icon={Award}
          />

          <div className="scroll-reveal space-y-3">
            {t.modules.tierList.tiers.map((tier: any, index: number) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl
                           hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border text-xl font-black ${getTierStyle(
                    tier.tier
                  )}`}
                >
                  {tier.tier}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg md:text-xl font-bold">{tier.name}</h3>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)]
                                 border border-[hsl(var(--nav-theme)/0.3)] font-semibold"
                    >
                      {tier.ovr}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-white/5 border border-border">
                      <ArrowRight className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                      {tier.obtain}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-border">
                      {tier.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Module 4: Cup Mode Guide ===== */}
      <section
        id="cup-mode-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.cupModeGuide.eyebrow}
            title={t.modules.cupModeGuide.title}
            subtitle={t.modules.cupModeGuide.subtitle}
            intro={t.modules.cupModeGuide.intro}
            icon={Trophy}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.cupModeGuide.stages.map((stage: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl
                           hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                    {stage.stage}
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  <div>
                    <span className="text-xs text-muted-foreground/70 uppercase">Requirement</span>
                    <p className="text-sm font-medium">{stage.requirement}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground/70 uppercase">Reward</span>
                    <p className="text-sm font-medium text-[hsl(var(--nav-theme-light))]">
                      {stage.reward}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{stage.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* ===== Module 5: Squad Rating Calculator ===== */}
      <section
        id="squad-rating-calculator"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.squadRatingCalculator.eyebrow}
            title={t.modules.squadRatingCalculator.title}
            subtitle={t.modules.squadRatingCalculator.subtitle}
            intro={t.modules.squadRatingCalculator.intro}
            icon={Calculator}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.squadRatingCalculator.inputs.map(
              (input: any, index: number) => (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl
                             hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                    {input.label}
                  </span>
                  <p className="text-xl md:text-2xl font-bold my-2 text-[hsl(var(--nav-theme-light))]">
                    {input.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {input.description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===== Module 6: Captains Guide ===== */}
      <section
        id="captains-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.captainsGuide.eyebrow}
            title={t.modules.captainsGuide.title}
            subtitle={t.modules.captainsGuide.subtitle}
            intro={t.modules.captainsGuide.intro}
            icon={Crown}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.captainsGuide.unlocks.map((unlock: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl
                           hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="font-bold text-base md:text-lg">{unlock.type}</h3>
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full
                                   bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex-shrink-0">
                    <Crown className="w-3.5 h-3.5" />
                    {unlock.reward}
                  </span>
                </div>
                <div className="mb-2.5">
                  <span className="text-xs text-muted-foreground/70 uppercase">Requirement</span>
                  <p className="text-sm font-medium">{unlock.requirement}</p>
                </div>
                <p className="text-sm text-muted-foreground">{unlock.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Module 7: Prime Players Guide ===== */}
      <section
        id="prime-players-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.primePlayersGuide.eyebrow}
            title={t.modules.primePlayersGuide.title}
            subtitle={t.modules.primePlayersGuide.subtitle}
            intro={t.modules.primePlayersGuide.intro}
            icon={Gem}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.primePlayersGuide.players.map((player: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl
                           hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full
                                   bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                                   text-[hsl(var(--nav-theme-light))] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    {player.badge}
                  </span>
                  <span className="text-xs text-muted-foreground">{player.source}</span>
                </div>
                <h3 className="font-bold text-base md:text-lg mb-2">{player.title}</h3>
                <p className="text-sm text-muted-foreground">{player.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Module 8: Rerolls Refreshes and Rewards ===== */}
      <section
        id="rerolls-refreshes-rewards"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.rerollsAndRefreshes.eyebrow}
            title={t.modules.rerollsAndRefreshes.title}
            subtitle={t.modules.rerollsAndRefreshes.subtitle}
            intro={t.modules.rerollsAndRefreshes.intro}
            icon={Coins}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.rerollsAndRefreshes.resources.map(
              (resource: any, index: number) => (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl
                             hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-base md:text-lg">{resource.name}</h3>
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full
                                     bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                                     text-[hsl(var(--nav-theme-light))] flex-shrink-0">
                      <Coins className="w-3.5 h-3.5" />
                      {resource.source}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground/70 uppercase">Use</span>
                      <p className="text-sm">{resource.use}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground/70 uppercase">Best Timing</span>
                      <p className="text-sm text-muted-foreground">{resource.timing}</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===== FAQ Section ===== */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* ===== CTA Section ===== */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner before footer */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ===== Footer ===== */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/communities/365587858"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition inline-flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {t.footer.bloxheedCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/82524183928567/Build-A-Soccer-Squad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t.footer.playRoblox}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=psXhyY8dk6A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t.footer.watchYoutube}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
