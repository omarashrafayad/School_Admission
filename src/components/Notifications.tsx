import React from "react";

const Notifications = () => {
    return (
        <div className="bg-[var(--bg-background)] p-4 rounded-lg">
            <h3 className="mb-3 text-[var(--color-accent2)] font-bold text-sm">
                Today
            </h3>
            <div className="pl-6 flex flex-col gap-5 mb-7">
                <div>
                    <p className="text-[var(--color-accent1)] text-xs mb-2">
                        Monday, June 31 2020
                    </p>
                    <p className="text-[var(--color-accent2)]">
                        <strong>Karen Hope </strong>
                        has created new task at{" "}
                        <span className="text-[var(--color-orange)] font-bold">
                            HIstory Lesson
                        </span>
                    </p>
                </div>
                <div>
                    <p className="text-[var(--color-accent1)] text-xs mb-2">
                        Monday, June 31 2020
                    </p>
                    <p className="text-[var(--color-accent2)]">
                        <span className="text-[var(--color-red)] font-bold">
                            [REMINDER]
                        </span>{" "}
                        Due date of{" "}
                        <span className="text-[var(--color-red)] font-bold">
                            Science Homework
                        </span>{" "}
                        task will be coming
                    </p>
                </div>
                <div>
                    <p className="text-[var(--color-accent1)] text-xs mb-2">
                        Monday, June 31 2020
                    </p>
                    <p className="text-[var(--color-accent2)]">
                        <strong>Tony Soap </strong>
                        commented at{" "}
                        <span className="text-[var(--color-red)] font-bold">
                            Science Homework
                        </span>
                    </p>
                </div>
                <div>
                    <p className="text-[var(--color-accent1)] text-xs mb-2">
                        Monday, June 31 2020
                    </p>
                    <p className="text-[var(--color-accent2)]">
                        <strong>Samantha William</strong> add 4 files on{" "}
                        <span className="text-[var(--color-primary)] font-bold">
                            Art Class
                        </span>
                    </p>
                </div>
                <div>
                    <p className="text-[var(--color-accent1)] text-xs mb-2">
                        Monday, June 31 2020
                    </p>
                    <p className="text-[var(--color-accent2)]">
                        <strong>You</strong> has moved{" "}
                        <span className="text-[var(--color-green)] font-bold">
                            “Biology Homework”
                        </span>{" "}
                        task to <strong>Done</strong>
                    </p>
                </div>
            </div>
            <h3 className="mb-3 text-[var(--color-accent2)] font-bold text-sm">
                Yesterday
            </h3>
            <div className="pl-6">
                <div className="mb-5">
                    <p className="text-[var(--color-accent1)] text-xs mb-2">
                        Sunday, June 30 2020
                    </p>
                    <p className="text-[var(--color-accent2)]">
                        <strong>Johnny Ahmad</strong> mentioned you at{" "}

<span className="text-[var(--color-yellow)] font-bold">
                            Art Class Homework
                        </span>
                    </p>
                </div>
                <div>
                    <p className="text-[var(--color-accent1)] text-xs mb-2">
                        Sunday, June 30 2020
                    </p>
                    <p className="text-[var(--color-accent2)]">
                        <strong>Nadila Adja</strong> mentioned you at{" "}
                        <span className="text-[var(--color-primary)] font-bold">
                            Programming Homework
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Notifications;