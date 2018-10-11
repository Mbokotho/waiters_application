
DROP  TABLE IF EXISTS shifts, waiters, roster;


create table shifts(
  id serial primary key,
    shift_day text not null);

create table waiters(
  id serial primary key,
    username text not null);

create table roster(
  id serial primary key,
  waiter_id int not null,
 foreign key(waiter_id) references waiters(id) ON DELETE CASCADE,
  shift_id int not null,
 foreign key(shift_id) references shifts(id) ON DELETE CASCADE);



insert into shifts (shift_day) values ('Monday');
insert into shifts (shift_day) values ('Tuesday');
insert into shifts (shift_day) values ('Wednesday');
insert into shifts (shift_day) values ('Thursday');
insert into shifts (shift_day) values ('Friday');
insert into shifts (shift_day) values ('Saturday');
insert into shifts (shift_day) values ('Sunday');



    





