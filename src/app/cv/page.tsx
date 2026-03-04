"use client";
import React, { useState, useEffect } from "react";
import { CVData } from "../../types/CV";
import { PDFRenderer } from "@/components/PDFRenderer";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { frenchCV as cvFr } from "../../../public/json/my-cv-fr";
import { englishCV as cvEn } from "../../../public/json/my-cv-en";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import TalkingLogo from "@/components/TalkingLogo";
import { useTheme } from "next-themes";

const CVPage: React.FC = () => {
  const { toast } = useToast();
  const locale = useLocale();
  const t = useTranslations("CVPage");
  const [cvData, setCvData] = useState<CVData>(locale === "en" ? cvEn : cvFr);
  const [pdfRenderKey, setPdfRenderKey] = useState(0);
  const { data: session } = useSession();
  const { theme } = useTheme();

  const extractObjectLiteral = (source: string): string | null => {
    const patterns = [
      /export\s+default\s+/,
      /export\s+const\s+\w+\s*(?::[^=]+)?=\s*/,
      /module\.exports\s*=\s*/,
    ];

    let startIndex = -1;
    for (const pattern of patterns) {
      const match = pattern.exec(source);
      if (match) {
        startIndex = match.index + match[0].length;
        break;
      }
    }

    if (startIndex === -1) return null;

    const braceStart = source.indexOf("{", startIndex);
    if (braceStart === -1) return null;

    let depth = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inTemplate = false;
    let inLineComment = false;
    let inBlockComment = false;
    let escaped = false;

    for (let i = braceStart; i < source.length; i++) {
      const char = source[i];
      const next = source[i + 1];

      if (inLineComment) {
        if (char === "\n") inLineComment = false;
        continue;
      }

      if (inBlockComment) {
        if (char === "*" && next === "/") {
          inBlockComment = false;
          i++;
        }
        continue;
      }

      if (!inSingleQuote && !inDoubleQuote && !inTemplate) {
        if (char === "/" && next === "/") {
          inLineComment = true;
          i++;
          continue;
        }
        if (char === "/" && next === "*") {
          inBlockComment = true;
          i++;
          continue;
        }
      }

      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (!inDoubleQuote && !inTemplate && char === "'") {
        inSingleQuote = !inSingleQuote;
        continue;
      }
      if (!inSingleQuote && !inTemplate && char === '"') {
        inDoubleQuote = !inDoubleQuote;
        continue;
      }
      if (!inSingleQuote && !inDoubleQuote && char === "`") {
        inTemplate = !inTemplate;
        continue;
      }

      if (inSingleQuote || inDoubleQuote || inTemplate) continue;

      if (char === "{") depth++;
      if (char === "}") {
        depth--;
        if (depth === 0) {
          return source.slice(braceStart, i + 1);
        }
      }
    }

    return null;
  };

  const parseUploadedCV = (text: string, fileName: string): CVData => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const isJson = extension === "json";

    if (isJson) {
      const parsed = JSON.parse(text);
      return (parsed?.cvData ?? parsed) as CVData;
    }

    const objectLiteral = extractObjectLiteral(text);
    if (!objectLiteral) {
      throw new Error("No exported object found");
    }

    const parsed = new Function(`return (${objectLiteral})`)();
    return (parsed?.cvData ?? parsed) as CVData;
  };

  const sanitizeCvData = (raw: CVData): CVData => {
    // Remove functions/prototypes and keep plain serializable data only.
    const plain = JSON.parse(JSON.stringify(raw ?? {})) as CVData;
    const toStringOrNull = (value: unknown): string | null =>
      value == null ? null : String(value);
    const toStringOrUndefined = (value: unknown): string | undefined =>
      value == null ? undefined : String(value);
    const toNumberOrNull = (value: unknown): number | null => {
      if (value == null) return null;
      const n = Number(value);
      return Number.isFinite(n) ? n : null;
    };

    return {
      ...plain,
      name: toStringOrNull(plain.name),
      title: toStringOrNull(plain.title),
      subtitle: toStringOrNull(plain.subtitle),
      about: toStringOrNull(plain.about),
      yearsOfExperience: toNumberOrNull(plain.yearsOfExperience),
      profileImage: toStringOrNull(plain.profileImage),
      profileImageDark: toStringOrNull(plain.profileImageDark),
      profileImagePdf: toStringOrNull(plain.profileImagePdf),
      profileImageDarkPdf: toStringOrNull(plain.profileImageDarkPdf),
      coreKeywords: Array.isArray(plain.coreKeywords)
        ? plain.coreKeywords.map((k) => String(k))
        : [],
      atsKeywords: Array.isArray(plain.atsKeywords)
        ? plain.atsKeywords.map((k) => String(k))
        : [],
      contact: Array.isArray(plain.contact)
        ? plain.contact.map((c) => ({
            key: String(c?.key ?? ""),
            value: toStringOrUndefined(c?.value),
            link: toStringOrUndefined(c?.link),
          }))
        : [],
      languages: Array.isArray(plain.languages)
        ? plain.languages.map((l) => ({
            name: String(l?.name ?? ""),
            level: toStringOrNull(l?.level),
          }))
        : [],
      activities: Array.isArray(plain.activities)
        ? plain.activities.map((a) => String(a))
        : [],
      skills: plain.skills
        ? {
            stack: Array.isArray(plain.skills.stack)
              ? plain.skills.stack.map((group) =>
                  Array.isArray(group)
                    ? group.map((skill) => ({
                        name: String(skill?.name ?? ""),
                        rating: toNumberOrNull(skill?.rating),
                      }))
                    : [],
                )
              : [],
            other: Array.isArray(plain.skills.other)
              ? plain.skills.other.map((skill) => ({
                  name: String(skill?.name ?? ""),
                  rating: toNumberOrNull(skill?.rating),
                }))
              : [],
          }
        : { stack: [], other: [] },
      experience: Array.isArray(plain.experience)
        ? plain.experience.map((exp) => ({
            title: toStringOrNull(exp?.title),
            place: toStringOrNull(exp?.place),
            placeDescription: toStringOrNull(exp?.placeDescription),
            period: toStringOrNull(exp?.period),
            link: toStringOrNull(exp?.link),
            order: toNumberOrNull(exp?.order) ?? undefined,
            description: Array.isArray(exp?.description)
              ? exp.description.map((d) => String(d))
              : [],
            skills: Array.isArray(exp?.skills)
              ? exp.skills.map((s) => String(s))
              : [],
          }))
        : [],
      education: Array.isArray(plain.education)
        ? plain.education.map((edu) => ({
            title: toStringOrNull(edu?.title),
            place: toStringOrNull(edu?.place),
            placeDescription: toStringOrNull(edu?.placeDescription),
            period: toStringOrNull(edu?.period),
            link: toStringOrNull(edu?.link),
            order: toNumberOrNull(edu?.order) ?? undefined,
            description: Array.isArray(edu?.description)
              ? edu.description.map((d) => String(d))
              : [],
            skills: Array.isArray(edu?.skills)
              ? edu.skills.map((s) => String(s))
              : [],
          }))
        : [],
    };
  };

  const handleJsonUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const candidateData = sanitizeCvData(parseUploadedCV(text, file.name));

      if (
        !candidateData ||
        typeof candidateData !== "object" ||
        !("contact" in candidateData)
      ) {
        throw new Error("Invalid CV file format");
      }

      setCvData(candidateData);
      setPdfRenderKey((prev) => prev + 1);
      toast({
        title: "Success",
        description: "CV file imported",
      });
    } catch (error) {
      console.error("❌ Error importing CV file:", error);
      toast({
        variant: "destructive",
        title: "Invalid CV file (.json/.ts/.js)",
      });
    } finally {
      // Allow re-uploading the same file without manual reset
      event.target.value = "";
    }
  };

  useEffect(() => {
    setCvData(locale === "en" ? cvEn : cvFr);
    setPdfRenderKey((prev) => prev + 1);
  }, [locale]);

  return (
    <div className="w-full flex flex-col gap-4 min-h-screen">
      <TalkingLogo
        text={t.raw("talkingHead")}
        littleHead={true}
        tooltip={true}
        className="w-full b-4 backdrop-blur-sm p-4 rounded-xl"
      />

      <div className="w-full flex justify-center">
        <div className="flex items-center">
          <div className="flex gap-2">
            {session?.user && (
              <label>
                <input
                  type="file"
                  accept="application/json,.json,.ts,.js,text/typescript,text/javascript"
                  className="hidden"
                  onChange={handleJsonUpload}
                />
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CV File
                  </span>
                </Button>
              </label>
            )}

          </div>

          {/* <div className='flex items-center gap-2'>
            <div className='text-sm text-foreground'>
              {language === 'en' ? 'English version' : 'Version Française'}
            </div>
            <Switch
              onClick={() => {
                setLanguage(language === 'en' ? 'fr' : 'en')
                setCvData(language === 'en' ? cvFr : cvEn)
              }}
              className='h-4'
            />
          </div> */}
        </div>
      </div>

      <div className="w-full h-[80vh]">
        <PDFRenderer
          key={pdfRenderKey}
          data={cvData}
          language={locale}
          theme={theme === "light" ? "light" : "dark"}
        />
      </div>
    </div>
  );
};

export default CVPage;
