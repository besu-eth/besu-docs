import React from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useSidebarBreadcrumbs } from "@docusaurus/plugin-content-docs/client";
import { useHomePageRoute } from "@docusaurus/theme-common/internal";
import { useLocation } from "@docusaurus/router";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import HomeBreadcrumbItem from "@theme/DocBreadcrumbs/Items/Home";
import DocBreadcrumbsStructuredData from "@theme/DocBreadcrumbs/StructuredData";
import styles from "./styles.module.css";

const SECTIONS = [
  { pathPrefix: "/public-networks", label: "Public networks", href: "/public-networks" },
  { pathPrefix: "/private-networks", label: "Private networks", href: "/private-networks" },
];

function getSectionItem(pathname) {
  return SECTIONS.find((s) => pathname.startsWith(s.pathPrefix)) ?? null;
}

function BreadcrumbsItemLink({ children, href, isLast }) {
  const className = "breadcrumbs__link";
  if (isLast) {
    return <span className={className}>{children}</span>;
  }
  return href ? (
    <Link className={className} href={href}>
      <span>{children}</span>
    </Link>
  ) : (
    <span className={className}>{children}</span>
  );
}

function BreadcrumbsItem({ children, active }) {
  return (
    <li
      className={clsx("breadcrumbs__item", {
        "breadcrumbs__item--active": active,
      })}
    >
      {children}
    </li>
  );
}

export default function DocBreadcrumbs() {
  const breadcrumbs = useSidebarBreadcrumbs();
  const homePageRoute = useHomePageRoute();
  const { pathname } = useLocation();

  if (!breadcrumbs) {
    return null;
  }

  const sectionItem = getSectionItem(pathname);

  // Avoid duplicating the section label when the first breadcrumb already points
  // to the section root (e.g. when viewing the /public-networks index page).
  const firstHref = breadcrumbs[0]?.href;
  const showSection = sectionItem && firstHref !== sectionItem.href;

  const allItems = showSection
    ? [{ label: sectionItem.label, href: sectionItem.href, _isSection: true }, ...breadcrumbs]
    : breadcrumbs;

  return (
    <>
      <DocBreadcrumbsStructuredData breadcrumbs={breadcrumbs} />
      <nav
        className={clsx(
          ThemeClassNames.docs.docBreadcrumbs,
          styles.breadcrumbsContainer,
        )}
        aria-label={translate({
          id: "theme.docs.breadcrumbs.navAriaLabel",
          message: "Breadcrumbs",
          description: "The ARIA label for the breadcrumbs",
        })}
      >
        <ul className="breadcrumbs">
          {homePageRoute && <HomeBreadcrumbItem />}
          {allItems.map((item, idx) => {
            const isLast = idx === allItems.length - 1;
            const href = item._isSection
              ? item.href
              : item.type === "category" && item.linkUnlisted
              ? undefined
              : item.href;
            return (
              <BreadcrumbsItem key={idx} active={isLast}>
                <BreadcrumbsItemLink href={href} isLast={isLast}>
                  {item.label}
                </BreadcrumbsItemLink>
              </BreadcrumbsItem>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
