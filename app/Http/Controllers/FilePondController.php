<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FilePondController extends Controller
{
    /*
     * Handle Profile Pic Upload */
    public function updateAvatar(Request $request, $id)
    {
        $this->validate($request, [
            'filepond-avatar' => 'required|image',
        ]);

        $avatar = $request->file('filepond-avatar')->store('public/avatars');
        $avatar = substr($avatar, 7);

        $user = User::findOrFail($id);

        // Delete profile pic if it's not the default one
        if ($user->avatar != '/storage/avatars/male_avatar.png') {

            // Get old avatar and delete it
            $oldAvatar = substr($user->avatar, 9);

            Storage::disk("public")->delete($oldAvatar);
        }

        $user->avatar = $avatar;
        $user->save();

        return response("Account updated", 200);
    }

    /*
     * Handle National ID Upload */
    public function updateNationalID(Request $request, $id)
    {
        $this->validate($request, [
            'filepond-national-id' => 'required|file',
        ]);

        $nationalID = $request->file('filepond-national-id')->store('public/national-ids');
        $nationalID = substr($nationalID, 7);

        $user = User::findOrFail($id);

        // Delete National ID if it exists
        if ($user->national_id_file) {

            // Get old National ID and delete it
            $oldNationalID = substr($user->national_id_file, 9);

            Storage::disk("public")->delete($oldNationalID);
        }

        $user->national_id_file = $nationalID;
        $user->save();

        return response("Account updated successfully", 200);
    }

    /*
     * Handle Material Upload */
    public function storeMaterial(Request $request)
    {
        $this->validate($request, [
            'filepond-material' => 'required|file',
        ]);

        // Store material
        $material = $request->file('filepond-material')->store('public/materials');

        $material = substr($material, 7);

        return $material;
    }

    /*
     * Handle Material Delete */
    public function destoryMaterial($id)
    {
        Storage::delete('public/materials/' . $id);

        return response("Material deleted", 200);
    }

    /*
     * Discussion Forum
     */

    /*
     * Handle Attachment Upload */
    public function storeAttachment(Request $request)
    {
        $this->validate($request, [
            'filepond-attachment' => 'required|file',
        ]);

        // Store Attachment
        $attachment = $request->file('filepond-attachment')->store('public/attachments');

        $attachment = substr($attachment, 7);

        return $attachment;
    }

    /*
     * Handle Attachment Delete */
    public function destoryAttachment($id)
    {
        Storage::delete('public/attachments/' . $id);

        return response("Attachment deleted", 200);
    }

    /*
     * Store Submissions */
    public function storeSubmission(Request $request, $sessionId, $unitId, $week, $userId, $type)
    {
        $this->validate($request, [
            "filepond-file" => "required|file",
        ]);

        $attachment = $request
            ->file('filepond-file')
            ->store('public/submissions');

        $attachment = substr($attachment, 7);

        $submissionQuery = Submission::where("academic_session_id", $sessionId)
            ->where("unit_id", $unitId)
            ->where("week", $week)
            ->where("user_id", $userId)
            ->where("type", $type);

        $submissionDoesntExist = $submissionQuery->doesntExist();

        if ($submissionDoesntExist) {
            // Add New Submission
            $submission = new Submission;
            $submission->academic_session_id = $sessionId;
            $submission->unit_id = $unitId;
            $submission->week = $week;
            $submission->user_id = $userId;
            $submission->type = $type;
            $submission->attachment = $attachment;
            $submission->save();

            $message = $type . " saved";
        } else {
            $submission = $submissionQuery->first();

            // Get old attachment and delete it
            $oldAttachment = substr($submission->attachment, 8);

            Storage::disk("public")->delete($oldAttachment);

            // Update Submission
            $submission->attachment = $attachment;
            $submission->save();

            $message = $type . " updated";
        }

        return response($message, 200);
    }
}
