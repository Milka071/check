-- Create procedures table
CREATE TABLE procedures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_daily BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create procedure_steps table
CREATE TABLE procedure_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  media_url TEXT,
  timer INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_schedules table
CREATE TABLE daily_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  procedure_ids UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_procedures_user_id ON procedures(user_id);
CREATE INDEX idx_procedures_created_at ON procedures(created_at);
CREATE INDEX idx_procedure_steps_procedure_id ON procedure_steps(procedure_id);
CREATE INDEX idx_procedure_steps_order ON procedure_steps("order");
CREATE INDEX idx_daily_schedules_user_id ON daily_schedules(user_id);
CREATE INDEX idx_daily_schedules_date ON daily_schedules(date);

-- Set up Row Level Security (RLS)
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedure_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own procedures" ON procedures
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own procedures" ON procedures
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own procedures" ON procedures
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own procedures" ON procedures
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view steps of their own procedures" ON procedure_steps
  FOR SELECT USING (procedure_id IN (SELECT id FROM procedures WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert steps of their own procedures" ON procedure_steps
  FOR INSERT WITH CHECK (procedure_id IN (SELECT id FROM procedures WHERE user_id = auth.uid()));

CREATE POLICY "Users can update steps of their own procedures" ON procedure_steps
  FOR UPDATE USING (procedure_id IN (SELECT id FROM procedures WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete steps of their own procedures" ON procedure_steps
  FOR DELETE USING (procedure_id IN (SELECT id FROM procedures WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own schedules" ON daily_schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own schedules" ON daily_schedules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedules" ON daily_schedules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedules" ON daily_schedules
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_procedures_updated_at BEFORE UPDATE
  ON procedures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_procedure_steps_updated_at BEFORE UPDATE
  ON procedure_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_schedules_updated_at BEFORE UPDATE
  ON daily_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();