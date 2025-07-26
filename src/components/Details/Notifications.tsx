
const today = new Date();

const formatted = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
});

today.setDate(today.getDate() - 1);

const formattedYesterday = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
});
console.log(formatted);
const Notifications = () => {
    return (
        <div className="bg-[var(--bg-background)] p-6 rounded-lg">
            <h3 className="mb-3 text-[var(--color-accent2)] font-bold text-sm">
                Today
            </h3>
            <div className="pl-5 ml-2 flex flex-col gap-5 mb-7 border-l border-gray-300">
                <div>
                    <p className="text-[var(--color-accent1)] text-xs mb-2">
                        {formatted}
                    </p>
                    <p className="text-[var(--color-accent2)] max-md:text-sm">
                        <strong>Karen Hope </strong>
                        has created new task at{" "}
                        <span className="text-[var(--color-orange)] font-bold">
                            HIstory Lesson
                        </span>
                    </p>
                </div>
                <div>
                    <p className="text-[var(--color-accent1)] text-xs mb-2">
                        Monday, June 31 2025
                    </p>
                    <p className="text-[var(--color-accent2)] max-md:text-sm">
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
                        Monday, June 31 2025
                    </p>
                    <p className="text-[var(--color-accent2)] max-md:text-sm">
                        <strong>Tony Soap </strong>
                        commented at{" "}
                        <span className="text-[var(--color-red)] font-bold">
                            Science Homework
                        </span>
                    </p>
                </div>
                <div>
                    <p className="text-[var(--color-accent1)] text-xs mb-2">
                        Monday, June 31 2025
                    </p>
                    <p className="text-[var(--color-accent2)] max-md:text-sm">
                        <strong>Samantha William</strong> add 4 files on{" "}
                        <span className="text-[var(--color-primary)] font-bold">
                            Art Class
                        </span>
                    </p>
                </div>
                <div>
                    <p className="text-[var(--color-accent1)] text-xs mb-2">
                        Monday, June 31 2025
                    </p>
                    <p className="text-[var(--color-accent2)] max-md:text-sm">
                        <strong>You</strong> have moved{" "}
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
            <div className="pl-5 ml-2 border-l border-gray-300">
                <div className="mb-5">
                    <p className="text-[var(--color-accent1)] text-xs mb-2">
                        {formattedYesterday}
                    </p>
                    <p className="text-[var(--color-accent2)] max-md:text-sm">
                        <strong>Johnny Ahmad</strong> mentioned you at{" "}
                        <span className="text-[var(--color-yellow)] font-bold">
                            Art Class Homework
                        </span>
                    </p>
                </div>
                <div>
                    <p className="text-[var(--color-accent1)] text-xs mb-2">

                        Sunday, June 30 2025
                    </p>
                    <p className="text-[var(--color-accent2)] max-md:text-sm">
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