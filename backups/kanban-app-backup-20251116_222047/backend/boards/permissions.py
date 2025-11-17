from rest_framework import permissions  # import DRF permission base class

# ----------------------------
# Allow project members or owner to access an object (Column or Task)
# ----------------------------
class IsProjectMemberOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Get the related project (obj can be Column or Task)
        project = getattr(obj, 'project', None) or (getattr(obj, 'column', None) and obj.column.project)
        # Allow if user is in members or is the owner
        return project and (request.user in project.members.all() or request.user == project.owner)


# ----------------------------
# Allow only project owner to edit/delete Project
# ----------------------------
class IsProjectOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # obj is a Project instance
        return request.user == getattr(obj, 'owner', None)


# ----------------------------
# Allow comment author, project members, or owner to access
# ----------------------------
class IsCommentAuthorOrProjectMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # obj is a Comment instance
        project = obj.task.project
        return request.user == obj.author or request.user in project.members.all() or request.user == project.owner


# ----------------------------
# Allow only the user to see/update their notifications
# ----------------------------
class IsNotificationUser(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # obj is a Notification instance
        return request.user == obj.user
