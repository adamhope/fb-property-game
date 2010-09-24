class User < ActiveRecord::Base
  def as_json(options=nil)
    {
      :id          => facebook_id,
      :best_streak => best_streak,
      :score       => score,
      :updated_at  => updated_at,
    }
  end
end
