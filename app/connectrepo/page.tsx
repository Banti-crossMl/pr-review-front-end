// "use client";

// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogClose,
// } from "@/components/ui/dialog";
// import {
//   ExternalLink,
//   Star,
//   GitFork,
//   AlertCircle,
//   Lock,
//   Calendar,
//   User,
//   X,
//   Github,
// } from "lucide-react";
// import type { Repository } from "@/lib/repository-data";
// import { fetchRepositoriesAction } from "../redux/features/fetchprSlice";
// import { useAppDispatch } from "../redux/redux/hooks";
// import { useSelector } from "react-redux";
// import { fetchRepositoryPullRequests } from "../redux/features/fetchchangesSlice";

// interface RepositoryCardProps {
//   repository: Repository;
//   handleclose: () => void;
// }

// export default function RepositoryCard({
//   repository,
//   handleclose,
// }: RepositoryCardProps) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const dispatch = useAppDispatch();
//   const { repositoryDetails } = useSelector((state: any) => state.pullrequest);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const getLanguageColor = (language: string) => {
//     const colors: Record<string, string> = {
//       Python:
//         "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/50",
//       JavaScript:
//         "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-800/50",
//       TypeScript:
//         "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800/50",
//       Java: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800/50",
//       Go: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800/50",
//       Rust: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/50",
//     };
//     return (
//       colors[language] ||
//       "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700/50"
//     );
//   };

//   const handleExternalLink = (e: React.MouseEvent, url: string) => {
//     e.stopPropagation();
//     e.preventDefault();
//     window.open(url, "_blank", "noopener,noreferrer");
//   };

//   const handleCardClick = () => {
//     const payload = { owner: repository.owner, name: repository.name };
//     dispatch(fetchRepositoriesAction(payload));
//     setIsModalOpen(true);
//   };

//   const handlePRView = (pr: any) => {
//     const payload = {
//       pr_number: pr.number,
//       repo: pr.repository_name,
//       owner: pr.repository_owner,
//       async_review: false,
//     };

//     console.log("file pr", pr);

//     console.log("file payload", payload);

//     dispatch(fetchRepositoryPullRequests(payload));

//     setIsModalOpen(false);
//     handleclose();
//   };

//   // Ensure repositoryDetails is an array
//   const pullRequests = Array.isArray(repositoryDetails?.data)
//     ? repositoryDetails?.data
//     : [];

//   return (
//     <>
//       <Card
//         className="group relative h-full bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-lg hover:border-border transition-all duration-300 hover:-translate-y-1 cursor-pointer"
//         onClick={handleCardClick}
//       >
//         <CardHeader className="pb-3">
//           <div className="flex items-start justify-between gap-3">
//             <div className="flex-1 min-w-0">
//               <CardTitle className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
//                 {repository.name}
//               </CardTitle>
//               <CardDescription className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
//                 <User className="h-3 w-3 flex-shrink-0" />
//                 <span className="truncate">{repository.owner}</span>
//               </CardDescription>
//             </div>

//             <div className="flex items-center gap-2 flex-shrink-0">
//               {repository.private && (
//                 <div className="p-1 rounded-full bg-red-100 dark:bg-red-900/30">
//                   <Lock className="h-3 w-3 text-red-600 dark:text-red-400" />
//                 </div>
//               )}
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground hover:bg-muted"
//                 onClick={(e) => handleExternalLink(e, repository.html_url)}
//               >
//                 <ExternalLink className="h-4 w-4" />
//                 <span className="sr-only">Open repository</span>
//               </Button>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           {repository.description && (
//             <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
//               {repository.description}
//             </p>
//           )}

//           <div className="flex flex-wrap gap-2">
//             {repository.language && (
//               <Badge
//                 variant="outline"
//                 className={`text-xs font-medium px-2 py-1 ${getLanguageColor(
//                   repository.language
//                 )}`}
//               >
//                 {repository.language}
//               </Badge>
//             )}
//             {repository.private && (
//               <Badge
//                 variant="outline"
//                 className="text-xs font-medium px-2 py-1 bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/50"
//               >
//                 Private
//               </Badge>
//             )}
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4 text-sm text-muted-foreground">
//               <div className="flex items-center gap-1 hover:text-foreground transition-colors">
//                 <Star className="h-3.5 w-3.5" />
//                 <span className="font-medium">
//                   {repository.stargazers_count}
//                 </span>
//               </div>
//               <div className="flex items-center gap-1 hover:text-foreground transition-colors">
//                 <GitFork className="h-3.5 w-3.5" />
//                 <span className="font-medium">{repository.forks_count}</span>
//               </div>
//               {repository.open_issues_count > 0 && (
//                 <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
//                   <AlertCircle className="h-3.5 w-3.5" />
//                   <span className="font-medium">
//                     {repository.open_issues_count}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
//             <div className="flex items-center gap-1">
//               <Calendar className="h-3 w-3 flex-shrink-0" />
//               <span>Created {formatDate(repository.created_at)}</span>
//             </div>
//             <span className="text-right">
//               Updated {formatDate(repository.updated_at)}
//             </span>
//           </div>
//         </CardContent>
//       </Card>

//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
//               <Github className="h-6 w-6 text-primary" />
//               Pull Requests - {repository.name}
//             </DialogTitle>
//             <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
//               <X className="h-4 w-4" />
//               <span className="sr-only">Close</span>
//             </DialogClose>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             {pullRequests.length > 0 ? (
//               pullRequests.map((pr: any) => (
//                 <div
//                   key={pr.id}
//                   className="border rounded-lg p-4 bg-card space-y-3"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-semibold text-foreground text-base truncate">
//                         #{pr.number} {pr.title}
//                       </h3>
//                       <div className="flex items-center gap-2 mt-1">
//                         <Badge
//                           variant={
//                             pr.state === "open" ? "default" : "secondary"
//                           }
//                           className={`text-xs ${
//                             pr.state === "open"
//                               ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800/50"
//                               : ""
//                           }`}
//                         >
//                           {pr.state}
//                         </Badge>
//                         {pr.draft && (
//                           <Badge variant="outline" className="text-xs">
//                             Draft
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={(e) => handleExternalLink(e, pr.html_url)}
//                       className="text-muted-foreground hover:text-foreground"
//                     >
//                       <ExternalLink className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   {pr.body && (
//                     <p className="text-sm text-muted-foreground leading-relaxed">
//                       {pr.body}
//                     </p>
//                   )}

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                       <span>by {pr.user?.login || pr.user_login}</span>
//                       <span>•</span>
//                       <span>{formatDate(pr.created_at)}</span>
//                     </div>
//                     <div className="flex items-center gap-3 text-xs text-muted-foreground">
//                       {pr.additions !== undefined && (
//                         <span className="text-green-600">+{pr.additions}</span>
//                       )}
//                       {pr.deletions !== undefined && (
//                         <span className="text-red-600">-{pr.deletions}</span>
//                       )}
//                       {pr.changed_files !== undefined && (
//                         <span>{pr.changed_files} files</span>
//                       )}
//                     </div>
//                   </div>

//                   {/* PR VIEW button with info */}
//                   <div className="pt-2">
//                     <Button className="w-full" onClick={() => handlePRView(pr)}>
//                       REVIEW PR
//                     </Button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <AlertCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
//                 <h3 className="font-medium text-foreground mb-1">
//                   No Pull Requests
//                 </h3>
//                 <p className="text-sm text-muted-foreground">
//                   This repository doesn't have any pull requests yet.
//                 </p>
//               </div>
//             )}

//             <div className="flex gap-3 pt-4 border-t">
//               <Button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleExternalLink(e, repository.html_url);
//                 }}
//                 className="flex-1"
//               >
//                 <ExternalLink className="h-4 w-4 mr-2" />
//                 View Repository
//               </Button>

//               <Button
//                 variant="outline"
//                 onClick={() => setIsModalOpen(false)}
//                 className="flex-1"
//               >
//                 Close
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }


import React from 'react';

const page = () => {
  return (
    <div>
      1
    </div>
  );
}

export default page;
