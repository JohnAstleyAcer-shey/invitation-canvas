import { useParams } from "react-router-dom";
import { useInvitation } from "@/features/admin/hooks/useInvitations";
import { BlockEditor } from "../components/BlockEditor";
import { Loader2 } from "lucide-react";

export default function BlockEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { data: invitation, isLoading } = useInvitation(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-2">
          <p className="text-lg font-display font-semibold text-foreground">Invitation not found</p>
          <p className="text-sm text-muted-foreground">It may have been deleted or you don't have access.</p>
        </div>
      </div>
    );
  }

  return <BlockEditor invitationId={invitation.id} invitationTitle={invitation.title} invitationSlug={invitation.slug} />;
}
