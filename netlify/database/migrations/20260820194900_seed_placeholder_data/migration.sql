-- Placeholder league data for League of Bums so the site isn't empty on first deploy.
-- All of this is editable/removable later through the password-protected admin pages.

INSERT INTO teams (slug, team_name, manager_name, motto, team_bio, manager_bio, founded) VALUES
('couch-cushions', 'The Couch Cushions', 'Dale Truncheon', 'We find value where others lose it.', 'Perennial middle-of-the-pack squad that somehow always sneaks into the playoffs on tiebreakers. Dale drafts entirely on vibes and a spreadsheet nobody else is allowed to see.', 'Dale has been commissioner-adjacent for six seasons and once traded a first-round pick for a kicker out of spite. Still not sorry.', 2019),
('thirsty-thursdays', 'Thirsty Thursdays', 'Priya Balogh', 'Undefeated at the bar, .500 on the field.', 'Named after the night the league was founded. Priya treats her bench like a rotating door and it somehow works more often than it should.', 'Priya runs a two-person marketing team by day and a ruthless waiver-wire operation by night. Three-time Sharpest GM award winner.', 2018),
('gutter-kings', 'Gutter Kings', 'Marcus Fennimore', 'Low expectations, lower standings.', 'The league''s lovable disaster. Every season starts with a bold prediction and ends with a courtesy bench clearing in Week 14.', 'Marcus has never finished higher than 5th but has won Most Improved twice, which he considers a personality trait.', 2018),
('sofa-king-good', 'Sofa King Good', 'Renata Vasquez', 'Yes, we know what it sounds like.', 'The reigning back-to-back regular season points leader. Renata''s roster construction is equal parts analytics and pure spite toward Marcus.', 'Renata is the only manager who has read the league bylaws in full, mostly so she can enforce them against everyone else.', 2020),
('waiver-wire-wizards', 'Waiver Wire Wizards', 'Owen Fitzgerald', 'We found him on a Tuesday.', 'Built entirely from streamers and desperation adds. Somehow made the championship game once. Nobody, including Owen, can explain how.', 'Owen sets 14 waiver claims a week and refreshes the app during meetings. His team name is also his personality.', 2021),
('recliner-rebellion', 'Recliner Rebellion', 'Talia Nkemelu', 'Rise up. Then sit back down.', 'A young, aggressive roster that trades constantly and occasionally to its own detriment. Talia has more active trades than the rest of the league combined.', 'Talia joined as a replacement manager in Week 3 of her rookie year and made the playoffs anyway. The league has not forgiven her.', 2022),
('broke-but-bold', 'Broke But Bold', 'Jaylen Cortes', 'All gas, no waiver budget.', 'Spends the entire FAAB budget by Week 4 every single year. Somehow also owns the league record for most points in a single week.', 'Jaylen treats every Sunday like a casino floor. Beloved by the league, feared by his own bench.', 2019),
('the-fumblers', 'The Fumblers', 'Greta Solheim', 'Dropping the ball since 2018.', 'Consistently mediocre in the most entertaining way possible. Greta has finished 6th, 7th, or 8th in five of the last six seasons.', 'Greta is the league historian and keeps the only complete paper trail of every bad trade ever made, including her own.', 2018),
('bench-warmers-united', 'Bench Warmers United', 'Andre Kowalczyk', 'Our stars stay seated.', 'Famous for starting the wrong lineup at least once a year, usually during a playoff week. A cautionary tale with a great logo.', 'Andre has set his lineup exactly on time zero times in franchise history and refuses to enable app notifications.', 2020),
('dumpster-fire-fc', 'Dumpster Fire FC', 'Nadia Okafor', 'It''s not a rebuild, it''s a lifestyle.', 'The league''s youngest franchise and already its most chaotic. Nadia has punted on more seasons by Week 6 than anyone in league history.', 'Nadia joined the league on a dare and has stayed out of pure spite toward everyone who said she wouldn''t last a year.', 2023);

-- Power rankings, 2026 season, weeks 1-2
INSERT INTO power_rankings (season, week, team_id, rank, blurb, trend)
SELECT 2026, 1, id, rnk, blurb, trend FROM (VALUES
  ('sofa-king-good', 1, 'Renata''s squad looks every bit the two-time reigning points leader.', 'same'),
  ('broke-but-bold', 2, 'Jaylen already found this year''s league-winning waiver claim.', 'up'),
  ('couch-cushions', 3, 'Dale''s vibes-based draft is somehow paying off early.', 'up'),
  ('thirsty-thursdays', 4, 'Priya''s bench is deeper than the standings show.', 'same'),
  ('recliner-rebellion', 5, 'Talia has already made three trades. It is Week 1.', 'down'),
  ('waiver-wire-wizards', 6, 'Owen''s streamer strategy has yet to find its groove.', 'same'),
  ('gutter-kings', 7, 'Marcus is rebuilding again. It is Week 1.', 'down'),
  ('the-fumblers', 8, 'Greta fumbled the bag on draft day but the tape doesn''t lie.', 'same'),
  ('bench-warmers-united', 9, 'Andre started his kicker at flex. Again.', 'down'),
  ('dumpster-fire-fc', 10, 'Nadia has already announced a rebuild. It is Week 1.', 'same')
) AS r(slug, rnk, blurb, trend)
JOIN teams ON teams.slug = r.slug;

INSERT INTO power_rankings (season, week, team_id, rank, blurb, trend)
SELECT 2026, 2, id, rnk, blurb, trend FROM (VALUES
  ('broke-but-bold', 1, 'Jaylen leapfrogs the field after a 162-point explosion.', 'up'),
  ('sofa-king-good', 2, 'Renata slips one spot but is still the model of consistency.', 'down'),
  ('thirsty-thursdays', 3, 'Priya''s waiver-wire instincts are paying dividends.', 'up'),
  ('couch-cushions', 4, 'Dale holds steady heading into a tough Week 3 slate.', 'same'),
  ('waiver-wire-wizards', 5, 'Owen finally found a streamer worth keeping.', 'up'),
  ('recliner-rebellion', 6, 'Talia''s fourth trade of the season is somehow her best yet.', 'up'),
  ('the-fumblers', 7, 'Greta''s bench outscored her starters. Again.', 'up'),
  ('gutter-kings', 8, 'Marcus insists the rebuild is "ahead of schedule."', 'down'),
  ('dumpster-fire-fc', 9, 'Nadia''s rebuild is now officially a teardown.', 'up'),
  ('bench-warmers-united', 10, 'Andre benched his best player for a bye-week fill-in.', 'down')
) AS r(slug, rnk, blurb, trend)
JOIN teams ON teams.slug = r.slug;

-- Matchups, 2026 season, weeks 1-2 (week 1 complete, week 2 upcoming)
INSERT INTO matchups (season, week, team_a_id, team_b_id, team_a_score, team_b_score, is_complete)
SELECT 2026, 1, a.id, b.id, s.score_a, s.score_b, true FROM (VALUES
  ('sofa-king-good', 'gutter-kings', 138, 96),
  ('broke-but-bold', 'bench-warmers-united', 162, 104),
  ('couch-cushions', 'dumpster-fire-fc', 121, 118),
  ('thirsty-thursdays', 'waiver-wire-wizards', 129, 111),
  ('recliner-rebellion', 'the-fumblers', 107, 101)
) AS s(slug_a, slug_b, score_a, score_b)
JOIN teams a ON a.slug = s.slug_a
JOIN teams b ON b.slug = s.slug_b;

INSERT INTO matchups (season, week, team_a_id, team_b_id, is_complete)
SELECT 2026, 2, a.id, b.id, false FROM (VALUES
  ('sofa-king-good', 'broke-but-bold'),
  ('gutter-kings', 'thirsty-thursdays'),
  ('dumpster-fire-fc', 'recliner-rebellion'),
  ('bench-warmers-united', 'couch-cushions'),
  ('the-fumblers', 'waiver-wire-wizards')
) AS s(slug_a, slug_b)
JOIN teams a ON a.slug = s.slug_a
JOIN teams b ON b.slug = s.slug_b;

-- Weekly previews
INSERT INTO weekly_previews (season, week, title, content) VALUES
(2026, 1, 'Week 1: The Whole League Is Undefeated (For Now)', 'Every season starts the same way: ten managers absolutely certain this is their year. Keep an eye on Sofa King Good, who returns nearly every key piece from back-to-back scoring titles, and Dumpster Fire FC, whose "rebuild" already has a bye-week casualty at flex. Broke But Bold has already blown through a third of its FAAB budget on a punt returner nobody else wanted. This league does not do subtlety.'),
(2026, 2, 'Week 2: Sofa King Good vs. Broke But Bold Headlines a Statement Slate', 'The two undefeated squads collide in the marquee matchup of the week, and if Jaylen''s Week 1 explosion was any indication, Renata''s title defense is about to get its first real test. Elsewhere, Gutter Kings and Thirsty Thursdays face off in a game that could decide who is actually rebuilding and who is just pretending. Bench Warmers United would like everyone to know Andre has, this week, remembered to check his lineup before kickoff.');

-- Podcast episodes (ManeyCast)
INSERT INTO podcast_episodes (title, description, drive_url, episode_number, published_at) VALUES
('Season Kickoff: Bold Predictions and Petty Grudges', 'The crew previews all ten squads, relitigates last year''s championship trade, and Dale explains his vibes-based draft strategy on the record for the first time.', 'https://drive.google.com/file/d/1a2B3cD4eF5gH6iJ7kL8mN9oP0qR1sT2u/view', 1, '2026-08-10 18:00:00'),
('Week 1 Reactions: Jaylen Broke the Budget Already', 'A full breakdown of Broke But Bold''s 162-point outburst, the Couch Cushions'' one-point nail-biter, and why Andre benched his best receiver for the second year running.', 'https://drive.google.com/file/d/2b3C4dE5fG6hI7jK8lM9nO0pQ1rS2tU3v/view', 2, '2026-08-17 18:00:00'),
('Trade Winds: Breaking Down the Recliner Rebellion Deal', 'Talia joins the pod to defend her fourth trade of the young season while the rest of the league tries to figure out what she''s building toward.', 'https://drive.google.com/file/d/3c4D5eF6gH7iJ8kL9mN0oP1qR2sT3uV4w/view', 3, '2026-08-19 18:00:00');

-- Trades (all-time)
INSERT INTO trades (trade_date, season, summary, details, team_ids)
SELECT '2026-08-18', 2026,
  'Recliner Rebellion sends a 2027 first-rounder to Dumpster Fire FC for a proven RB2.',
  'Talia continues her aggressive win-now approach in just her third season, betting a future first on immediate production. Nadia, fully committed to the teardown, happily stockpiles more draft capital.',
  jsonb_build_array(a.id, b.id)
FROM teams a, teams b WHERE a.slug = 'recliner-rebellion' AND b.slug = 'dumpster-fire-fc';

INSERT INTO trades (trade_date, season, summary, details, team_ids)
SELECT '2025-11-02', 2025,
  'Blockbuster three-team deal reshapes the playoff picture in Week 9.',
  'Sofa King Good, Broke But Bold, and Waiver Wire Wizards combined for a nine-asset trade that took the league group chat three days to fully untangle. Renata came away with the receiver depth that fueled her title run.',
  jsonb_build_array(a.id, b.id, c.id)
FROM teams a, teams b, teams c
WHERE a.slug = 'sofa-king-good' AND b.slug = 'broke-but-bold' AND c.slug = 'waiver-wire-wizards';

INSERT INTO trades (trade_date, season, summary, details, team_ids)
SELECT '2024-10-14', 2024,
  'Couch Cushions flip an aging veteran to the Gutter Kings for two future picks.',
  'Dale reads the room perfectly, selling high on a 30-something running back one week before an injury. Marcus, ever the optimist, is still waiting on that veteran''s "one more good year."',
  jsonb_build_array(a.id, b.id)
FROM teams a, teams b WHERE a.slug = 'couch-cushions' AND b.slug = 'gutter-kings';

-- Champions (past winners)
INSERT INTO champions (season, team_id, record, note)
SELECT 2025, id, '11-3', 'Back-to-back champions after a dominant playoff run capped by a 41-point win in the final.' FROM teams WHERE slug = 'sofa-king-good';
INSERT INTO champions (season, team_id, record, note)
SELECT 2024, id, '10-4', 'First title in franchise history, clinched on a last-second waiver claim that turned into the championship MVP.' FROM teams WHERE slug = 'sofa-king-good';
INSERT INTO champions (season, team_id, record, note)
SELECT 2023, id, '9-5', 'The original Waiver Wire Wizards Cinderella run — built from streamers, still undefeated in league lore.' FROM teams WHERE slug = 'waiver-wire-wizards';

-- Awards
INSERT INTO awards (season, title, team_id, description)
SELECT 2025, 'League Champion', id, 'Back-to-back title after a dominant playoff run.' FROM teams WHERE slug = 'sofa-king-good';
INSERT INTO awards (season, title, team_id, description)
SELECT 2025, 'Sharpest GM', id, 'Best waiver-wire and trade value added over the season.' FROM teams WHERE slug = 'thirsty-thursdays';
INSERT INTO awards (season, title, team_id, description)
SELECT 2025, 'Most Improved', id, 'Jumped from 9th to 3rd place year over year.' FROM teams WHERE slug = 'gutter-kings';
INSERT INTO awards (season, title, team_id, description)
SELECT 2025, 'Wooden Spoon', id, 'Finished dead last after benching a top scorer in Week 13.' FROM teams WHERE slug = 'bench-warmers-united';
INSERT INTO awards (season, title, team_id, description)
SELECT 2025, 'Best Team Name', id, 'Unanimous league vote, three years running.' FROM teams WHERE slug = 'dumpster-fire-fc';

-- Team season-by-season history
INSERT INTO team_history_entries (team_id, season, wins, losses, ties, finish, note)
SELECT id, 2025, 8, 6, 0, '3rd', 'Lost in the semifinal on a Monday night comeback.' FROM teams WHERE slug = 'couch-cushions';
INSERT INTO team_history_entries (team_id, season, wins, losses, ties, finish, note)
SELECT id, 2024, 7, 7, 0, '6th', 'Missed the playoffs on point differential.' FROM teams WHERE slug = 'couch-cushions';
INSERT INTO team_history_entries (team_id, season, wins, losses, ties, finish, note)
SELECT id, 2025, 11, 3, 0, '1st', 'Back-to-back champions.' FROM teams WHERE slug = 'sofa-king-good';
INSERT INTO team_history_entries (team_id, season, wins, losses, ties, finish, note)
SELECT id, 2024, 10, 4, 0, '1st', 'First title in franchise history.' FROM teams WHERE slug = 'sofa-king-good';
INSERT INTO team_history_entries (team_id, season, wins, losses, ties, finish, note)
SELECT id, 2023, 9, 5, 0, '2nd', 'Lost the final in a shootout.' FROM teams WHERE slug = 'sofa-king-good';
INSERT INTO team_history_entries (team_id, season, wins, losses, ties, finish, note)
SELECT id, 2025, 4, 10, 0, '9th', 'A step forward. Technically.' FROM teams WHERE slug = 'gutter-kings';
INSERT INTO team_history_entries (team_id, season, wins, losses, ties, finish, note)
SELECT id, 2023, 9, 5, 0, '1st', 'Cinderella run built entirely from streamers.' FROM teams WHERE slug = 'waiver-wire-wizards';
INSERT INTO team_history_entries (team_id, season, wins, losses, ties, finish, note)
SELECT id, 2025, 3, 11, 0, '10th', 'Wooden Spoon winner.' FROM teams WHERE slug = 'bench-warmers-united';
