import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import NotFound from "@/components/common/NotFound";
import QuizList from "@/components/quiz/QuizList";
import { ClockIcon } from '@heroicons/react/24/solid';

export default function ProfilePage() {
    const { identifier } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState([]);

    const categories = [
        { id: 1, name: "Math" },
        { id: 2, name: "Science" },
        { id: 3, name: "History" },
        { id: 4, name: "Literature" },
    ];

    const fetchProfile = async () => {
        try {
            let identifierValue = identifier;
            let res;
            if (identifier.startsWith("@")) {
                identifierValue = identifier.substring(1);
                res = await userService.getByUsername(identifierValue);
            } else {
                res = await userService.getById(identifierValue);
            }
            setProfile(res.data);
            setQuizzes(res.data.quizzes); // reset quizzes
            console.log("Fetched profile:", res.data);
        } catch (err) {
            console.error("Không tìm thấy user", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [identifier]);

    if (loading) return <ProfileSkeleton />;
    if (!profile) return <NotFound message="Không tìm thấy người dùng" />;

    return (
        <div className="py-6">
            <div className="bg-white rounded-2xl shadow-md p-6 ">
                {/* Thông tin user */}
                <h1 className="text-2xl font-bold text-gray-800">
                    {profile.last_name} {profile.first_name}
                </h1>
                <p className="text-gray-500">@{profile.username}</p>

                <p
                    className="text-gray-700 mt-3 whitespace-pre-line line-clamp-2 min-h-[3rem]"
                >
                    {profile.notes ? profile.notes : "Chưa có giới thiệu."}
                </p>
                {/* Action */}

                <div className="mt-2 flex justify-between items-center relative">
                    <p className="text-gray-500 flex items-center font-semibold gap-1">
                        <ClockIcon className="w-4 h-4" />
                        Tham gia vào{" "}
                        {new Date(profile.created_at).toLocaleDateString("vi-VN", {
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>

            </div>
            <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
                <QuizList
                    quizzes={quizzes}
                    loading={loading}
                    categories={categories}
                    updateQuizzes={() => fetchProfile()}
                />
            </div>
        </div>
    );
}
