
create table users (
    userId integer primary key default 0 not null,
    username text not null,
    password text not null
);

create table news (
    newsId integer primary key default 0 not null,
    title text not null,
    body text not null,
    newsDate text not null,
    userId interger not null,
    foreign key (userId) references users(userId)
);

create table activities (
    activityId integer primary key default 0 not null,
    title text not null,
    body text not null,
    userId interger not null,
    foreign key (userId) references users(userId)

);