-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Properties are viewable by everyone"
ON public.properties FOR SELECT
TO public
USING (true);

CREATE POLICY "Agents can create properties"
ON public.properties FOR INSERT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles
  WHERE id = auth.uid() AND role = 'agent'
));

CREATE POLICY "Agents can update own properties"
ON public.properties FOR UPDATE
TO authenticated
USING (agent_id = auth.uid());

-- Saved properties policies
CREATE POLICY "Users can view own saved properties"
ON public.saved_properties FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can save properties"
ON public.saved_properties FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unsave properties"
ON public.saved_properties FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
ON public.reviews FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can create reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view own messages"
ON public.messages FOR SELECT
TO authenticated
USING (
  auth.uid() = sender_id OR
  auth.uid() = receiver_id
);

CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can mark notifications as read"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid());
